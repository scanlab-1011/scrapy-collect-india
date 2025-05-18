
import { ScrapType, ScrapCategory } from '@/types';
import { SCRAP_CATEGORIES } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, File, Package, Tv, User } from 'lucide-react';

interface CategorySelectionProps {
  selectedCategory: ScrapType;
  onCategorySelect: (category: ScrapType) => void;
  onNext: () => void;
}

export default function CategorySelection({
  selectedCategory,
  onCategorySelect,
  onNext
}: CategorySelectionProps) {
  const handleSelectCategory = (category: ScrapType) => {
    onCategorySelect(category);
  };

  // Group categories for better display
  const categoryGroups = [
    {
      title: "Metals",
      categories: SCRAP_CATEGORIES.filter(c => 
        [ScrapType.IRON, ScrapType.COPPER, ScrapType.ALUMINIUM, ScrapType.BRASS, 
         ScrapType.STEEL, ScrapType.MIXED_METALS].includes(c.type)
      ),
      icon: Package
    },
    {
      title: "Paper & Cardboard",
      categories: SCRAP_CATEGORIES.filter(c => 
        [ScrapType.PAPER, ScrapType.CARDBOARD, ScrapType.BOOKS].includes(c.type)
      ),
      icon: File
    },
    {
      title: "Plastics",
      categories: SCRAP_CATEGORIES.filter(c => 
        [ScrapType.PLASTIC_HDPE, ScrapType.PLASTIC_PET].includes(c.type)
      ),
      icon: Package
    },
    {
      title: "Other Materials",
      categories: SCRAP_CATEGORIES.filter(c => 
        [ScrapType.E_WASTE, ScrapType.GLASS].includes(c.type)
      ),
      icon: Tv
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">1. What type of scrap do you want to sell?</h2>
      
      <div className="space-y-4">
        {categoryGroups.map(group => (
          <div key={group.title} className="space-y-3">
            <h3 className="text-md font-medium flex items-center gap-2">
              <group.icon className="h-5 w-5" />
              {group.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.categories.map(category => (
                <Card 
                  key={category.type}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category.type
                      ? 'border-scrapy-500 ring-2 ring-scrapy-500/20'
                      : 'hover:border-scrapy-200'
                  }`}
                  onClick={() => handleSelectCategory(category.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                    <p className="text-xs font-medium mt-2">Approx. {category.priceRange}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}
