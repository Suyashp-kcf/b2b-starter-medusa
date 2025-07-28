import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { clx, Container, Heading, Text, Badge } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

// The API returns: { availability: Array<{ variant_id, available_quantity, stock_by_location: Record<string, number> }> }
type VariantAvailability = {
  variant_id: string
  available_quantity: number
  stock_by_location: Record<string, number>
}

type InventoryByLocation = Record<string, number>

const ProductInventoryWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  // Fetch variant availability from the custom API route
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/admin/products/${product.id}/availability`)
      if (!res.ok) throw new Error("Failed to fetch availability")
      return res.json()
    },
    queryKey: [["product", product.id, "variant-availability"]],
  })

  // Aggregate available_quantity by stock_location_id across all variants
  const inventoryByLocation: InventoryByLocation = useMemo(() => {
    const result: InventoryByLocation = {}
    const variants: VariantAvailability[] = data?.availability || []
    for (const variant of variants) {
      if (variant.stock_by_location) {
        for (const [location, quantity] of Object.entries(variant.stock_by_location)) {
          if (!result[location]) {
            result[location] = 0
          }
          result[location] += quantity
        }
      }
    }
    return result
  }, [data])

  const hasInventory = Object.keys(inventoryByLocation).length > 0
  const totalStock = Object.values(inventoryByLocation).reduce((sum, quantity) => sum + quantity, 0)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Stock Levels</Heading>
        </div>
        {hasInventory && (
          <Badge color="grey">
            Total: {totalStock} units
          </Badge>
        )}
      </div>
      {isLoading ? (
        <div className="px-6 py-4">
          <Text size="small">Loading inventory...</Text>
        </div>
      ) : hasInventory ? (
        <>
          <div className="px-6 py-3 bg-ui-bg-subtle grid grid-cols-2">
            <Text size="small" weight="plus" className="text-ui-fg-subtle">
              Location
            </Text>
            <Text size="small" weight="plus" className="text-ui-fg-subtle">
              Available Stock
            </Text>
          </div>
          {Object.entries(inventoryByLocation).map(([location, quantity], index) => (
            <div
              key={location}
              className={clx(
                "grid grid-cols-2 items-center px-6 py-4",
                index === Object.keys(inventoryByLocation).length - 1 ? "" : "border-b"
              )}
            >
              <Text size="small" weight="plus" leading="compact">
                {location}
              </Text>
              <div className="flex items-center gap-2">
                <Text
                  size="small"
                  leading="compact"
                  className={clx(
                    "font-mono",
                    quantity === 0 ? "text-red-500" : 
                    quantity < 10 ? "text-orange-500" : "text-green-600"
                  )}
                >
                  {quantity} units
                </Text>
                {quantity === 0 && (
                  <Badge color="red" size="small">
                    Out of Stock
                  </Badge>
                )}
                {quantity > 0 && quantity < 10 && (
                  <Badge color="orange" size="small">
                    Low Stock
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            No stock information available for this product.
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductInventoryWidget 