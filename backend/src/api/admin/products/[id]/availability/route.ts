import { getVariantAvailability } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export default async function handler(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const container = req.scope

  // Get all variants for the product
  const productService = container.resolve("productService") as any
  const product = await productService.retrieve(id, { relations: ["variants"] })
  const variant_ids = product.variants.map((v: any) => v.id)

  // Always pass sales_channel_id as a string (empty string if not provided)
  const sales_channel_id = typeof req.query.sales_channel_id === "string" ? req.query.sales_channel_id : ""

  // Logging for debugging
  console.log("[AVAILABILITY ROUTE] product id:", id)
  console.log("[AVAILABILITY ROUTE] variant_ids:", variant_ids)
  console.log("[AVAILABILITY ROUTE] sales_channel_id:", sales_channel_id)

  // Get availability
  const query = container.resolve("query")
  const availability = await getVariantAvailability(query, { variant_ids, sales_channel_id })

  // Log the result
  console.log("[AVAILABILITY ROUTE] availability result:", JSON.stringify(availability, null, 2))

  res.status(200).json({ availability })
} 