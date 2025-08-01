import React, { useState } from "react";
import { SearchFilters } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface ProductFiltersProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  onApplyFilters?: () => void;
}

interface Preferences {
  itemsPerPage: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  onApplyFilters,
}) => {
  const [preferences, setPreferences] = useState<Preferences>({
    itemsPerPage: 10,
  });
  // Local state for price slider
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange || [0, 100000] // Change max to 100000 for INR
  );

  // Categories for filtering
  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "grocery", label: "Grocery" },
  ];

  // Brands for filtering (including popular Indian brands)
  const brands = [
    { value: "samsung", label: "Samsung" },
    { value: "apple", label: "Apple" },
    { value: "mi", label: "Xiaomi/Mi" },
    { value: "oneplus", label: "OnePlus" },
    { value: "vivo", label: "Vivo" },
    { value: "oppo", label: "Oppo" },
    { value: "realme", label: "Realme" },
    { value: "flipkart", label: "Flipkart" },
    { value: "amazon", label: "Amazon" },
    { value: "boat", label: "boAt" },
    { value: "tata", label: "Tata" },
    { value: "reliance", label: "Reliance" },
    { value: "patanjali", label: "Patanjali" },
    { value: "haldiram", label: "Haldiram's" },
    { value: "myntra", label: "Myntra" },
  ];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category });
  };

  // Handle brand selection/deselection
  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = filters.brands || [];

    if (checked) {
      setFilters({
        ...filters,
        brands: [...currentBrands, brand],
      });
    } else {
      setFilters({
        ...filters,
        brands: currentBrands.filter((b) => b !== brand),
      });
    }
  };

  // Handle delivery options
  const handleDeliveryOptionChange = (
    option: "codAvailable" | "freeDelivery" | "expressDelivery",
    checked: boolean
  ) => {
    const deliveryOptions = filters.deliveryOptions || {};

    setFilters({
      ...filters,
      deliveryOptions: {
        ...deliveryOptions,
        [option]: checked,
      },
    });
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setFilters({
      ...filters,
      rating,
    });
  };

  // Handle price range change and apply on slider end
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const applyPriceRange = () => {
    setFilters({
      ...filters,
      priceRange: [priceRange[0], priceRange[1]],
    });
  };

  // Handle filters reset
  const resetFilters = () => {
    setFilters({});
    setPriceRange([0, 100000]); // Changed from 2000 to 100000
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  // Apply all filters
  const applyFilters = () => {
    // Prepare filters object with only active filters
    const activeFilters: SearchFilters = {};

    if (filters.category) {
      activeFilters.category = filters.category;
    }

    if (filters.brands?.length) {
      activeFilters.brands = filters.brands;
    }

    if (filters.rating) {
      activeFilters.rating = filters.rating;
    }

    if (filters.deliveryOptions) {
      activeFilters.deliveryOptions = {
        codAvailable: filters.deliveryOptions.codAvailable || false,
        freeDelivery: filters.deliveryOptions.freeDelivery || false,
        expressDelivery: filters.deliveryOptions.expressDelivery || false,
      };
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 100000) {
      // Changed from 2000 to 100000
      activeFilters.priceRange = priceRange;
    }

    // Update filters
    setFilters(activeFilters);

    // Show notification that filters are being applied
    if (onApplyFilters) {
      // Create a summary of active filters for feedback
      const activeFilters = [];

      if (filters.category) {
        activeFilters.push(`Category: ${filters.category}`);
      }

      if (
        filters.priceRange &&
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000)
      ) {
        activeFilters.push(
          `Price: ${formatPrice(filters.priceRange[0])} - ${formatPrice(
            filters.priceRange[1]
          )}`
        );
      }

      if (filters.brands && filters.brands.length > 0) {
        activeFilters.push(`Brands: ${filters.brands.length} selected`);
      }

      if (filters.rating) {
        activeFilters.push(`Rating: ${filters.rating}+ stars`);
      }

      if (filters.deliveryOptions?.codAvailable) {
        activeFilters.push("COD Available");
      }

      if (filters.deliveryOptions?.freeDelivery) {
        activeFilters.push("Free Delivery");
      }

      if (filters.deliveryOptions?.expressDelivery) {
        activeFilters.push("Express Delivery");
      }

      // Alert the user about applied filters
      alert(
        `Applying filters: ${
          activeFilters.length > 0 ? activeFilters.join(", ") : "None"
        }`
      );

      onApplyFilters();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading font-semibold text-lg">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary-600"
        >
          Reset
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.value}`}
                name="category"
                checked={filters.category === category.value}
                onChange={() => handleCategoryChange(category.value)}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <Label
                htmlFor={`category-${category.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Range Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-sm">Price Range (₹)</h4>
          <span className="text-xs text-gray-500">
            ₹{priceRange[0].toLocaleString("en-IN")} - ₹
            {priceRange[1].toLocaleString("en-IN")}
          </span>
        </div>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          value={[priceRange[0], priceRange[1]]}
          min={0}
          max={100000} // Set max to 100,000 INR
          step={1000} // Use 1,000 steps for INR
          onValueChange={handlePriceRangeChange} // Corrected from handlePriceRangeRange
          onValueCommit={applyPriceRange}
          className="my-4"
        />
      </div>

      <Separator className="my-4" />

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.value} className="flex items-center">
              <Checkbox
                id={`brand-${brand.value}`}
                checked={(filters.brands || []).includes(brand.value)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`brand-${brand.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {brand.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Delivery Options */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Delivery Options</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="cod-available"
              checked={filters.deliveryOptions?.codAvailable || false}
              onCheckedChange={(checked) =>
                handleDeliveryOptionChange("codAvailable", checked as boolean)
              }
            />
            <Label
              htmlFor="cod-available"
              className="ml-2 text-sm text-gray-700"
            >
              Cash on Delivery
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="free-delivery"
              checked={filters.deliveryOptions?.freeDelivery || false}
              onCheckedChange={(checked) =>
                handleDeliveryOptionChange("freeDelivery", checked as boolean)
              }
            />
            <Label
              htmlFor="free-delivery"
              className="ml-2 text-sm text-gray-700"
            >
              Free Delivery
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="express-delivery"
              checked={filters.deliveryOptions?.expressDelivery || false}
              onCheckedChange={(checked) =>
                handleDeliveryOptionChange(
                  "expressDelivery",
                  checked as boolean
                )
              }
            />
            <Label
              htmlFor="express-delivery"
              className="ml-2 text-sm text-gray-700"
            >
              Express Delivery
            </Label>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="ml-2 text-sm text-gray-700 flex items-center"
              >
                <div className="flex text-amber-500 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill={i < rating ? "currentColor" : "#e5e7eb"}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                & Up
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button (for mobile view) */}
      <Button className="w-full mt-4" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
};

export default ProductFilters;
