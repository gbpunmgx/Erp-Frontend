"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Package, Layers, Tag, Award, Ruler, Barcode } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BarcodeManagement from "@/app/(main)/features/product/components/barcode"; // Import the separate component
import BatchManagement from "@/app/(main)/features/product/components/batch";

const mockCategories = [
  { id: 1, name: "Electronics", description: "Gadgets and devices" },
  { id: 2, name: "Clothing", description: "Apparel and accessories" },
];

const mockBrands = [
  { id: 1, name: "TechTrend", logo: "techtrend.png" },
  { id: 2, name: "FashionPeak", logo: "fashionpeak.png" },
];

const mockUnits = [
  { id: 1, name: "Piece", abbreviation: "pc" },
  { id: 2, name: "Kilogram", abbreviation: "kg" },
];

const ProductsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Products</h2>
      <p className="text-muted-foreground">Manage your product catalog here.</p>
    </div>
  );
};

const CategoriesTab: React.FC<{ categories: { id: number; name: string; description: string }[] }> = ({
  categories,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Categories</h2>
      <p className="text-muted-foreground">Manage product categories here.</p>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="py-2">
            {category.name} - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

const BrandsTab: React.FC<{ brands: { id: number; name: string; logo: string }[] }> = ({ brands }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Brands</h2>
      <p className="text-muted-foreground">Manage product brands here.</p>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id} className="py-2">
            {brand.name} (Logo: {brand.logo})
          </li>
        ))}
      </ul>
    </div>
  );
};

const UnitsTab: React.FC<{ units: { id: number; name: string; abbreviation: string }[] }> = ({ units }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Units</h2>
      <p className="text-muted-foreground">Manage measurement units here.</p>
      <ul>
        {units.map((unit) => (
          <li key={unit.id} className="py-2">
            {unit.name} ({unit.abbreviation})
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "barcodes" | "batches" | "categories" | "brands" | "units">(
    "products",
  );

  return (
    <Card className="p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Package className="text-primary h-8 w-8" />
          <span>Product Catalogue</span>
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="barcodes" className="flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            Barcodes
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Batches
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Brands
          </TabsTrigger>
          <TabsTrigger value="units" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Units
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="barcodes">
          <BarcodeManagement />
        </TabsContent>

        <TabsContent value="batches">
          <BatchManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab categories={mockCategories} />
        </TabsContent>

        <TabsContent value="brands">
          <BrandsTab brands={mockBrands} />
        </TabsContent>

        <TabsContent value="units">
          <UnitsTab units={mockUnits} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProductManagement;
