"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const enquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  gstin: z.string().optional(),
  phone: z.string().regex(/^[0-9+ ]{10,14}$/, "Valid 10-digit mobile number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  locationState: z.string().min(2, "State is required"),
  locationCity: z.string().optional(),
  cropType: z.string().optional(),
  quantityText: z.string().min(1, "Please specify required quantity (e.g. 5 Tonnes, 100 bags)"),
  message: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export async function submitB2BEnquiryAction(input: EnquiryInput) {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid form data",
    };
  }

  const data = parsed.data;

  // Validate GSTIN if provided
  if (data.gstin && data.gstin.trim()) {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(data.gstin.trim().toUpperCase())) {
      return { success: false, error: "Please enter a valid 15-character GSTIN format." };
    }
  }

  try {
    const lead = await prisma.leadEnquiry.create({
      data: {
        name: data.name.trim(),
        companyName: data.companyName?.trim() || null,
        gstin: data.gstin?.trim().toUpperCase() || null,
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        locationState: data.locationState.trim(),
        locationCity: data.locationCity?.trim() || null,
        cropType: data.cropType?.trim() || null,
        quantityText: data.quantityText.trim(),
        message: data.message?.trim() || null,
        status: "NEW",
      },
    });

    // Notify sales via Resend if live key provided
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.includes("mock")) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Ecozza Green <notifications@ecozzagreen.in>",
            to: process.env.CONTACT_SALES_EMAIL || "sales@ecozzagreen.in",
            subject: `New B2B Bulk Enquiry from ${data.name} (${data.quantityText})`,
            text: `New lead received from ${data.name} (${data.companyName || "Individual"}).\nPhone: ${data.phone}\nQuantity: ${data.quantityText}\nLocation: ${data.locationState}`,
          }),
        });
      } catch (emailErr) {
        console.error("Resend notification error:", emailErr);
      }
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");

    return {
      success: true,
      leadId: lead.id,
      name: lead.name,
      quantityText: lead.quantityText,
    };
  } catch (err: any) {
    console.error("Enquiry submission error:", err);
    return { success: false, error: "Failed to submit enquiry. Please try again." };
  }
}
