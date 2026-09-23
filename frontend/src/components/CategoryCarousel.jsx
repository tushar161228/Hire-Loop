import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

import {
  Code2,
  Server,
  BarChart3,
  Palette,
  Layers,
} from "lucide-react";

const category = [
  {
    label: "Frontend Developer",
    query: "Frontend Developer",
    icon: Code2,
  },
  {
    label: "Backend Developer",
    query: "Backend Developer",
    icon: Server,
  },
  {
    label: "Data Science",
    query: "Data Science",
    icon: BarChart3,
  },
  {
    label: "Graphic Designer",
    query: "Graphic Designer",
    icon: Palette,
  },
  {
    label: "FullStack Developer",
    query: "FullStack Developer",
    icon: Layers,
  },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [active, setActive] = useState(null);

  const searchJobHandler = (category) => {
    setActive(category.label);

    // Store the selected category in Redux
    dispatch(setSearchedQuery(category.query));

    // Go to Browse page
    navigate("/browse");
  };

  return (
    <div>
      <Carousel className="w-full max-w-2xl mx-auto my-16">

        <CarouselContent className="-ml-2">

          {category.map((cat) => {
            const Icon = cat.icon;

            const isActive = active === cat.label;

            return (
              <CarouselItem
                key={cat.label}
                className="basis-auto pl-2"
              >
                <button
                  type="button"
                  onClick={() => searchJobHandler(cat)}
                  className={`
                    flex items-center gap-2
                    whitespace-nowrap
                    rounded-full
                    px-5 py-2.5
                    text-sm font-semibold
                    border
                    transition-all
                    duration-200
                    shadow-sm
                    hover:shadow-md

                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#6A38C2] to-[#F83002] text-white border-transparent"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-[#6A38C2] hover:text-[#6A38C2]"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />

                  {cat.label}
                </button>
              </CarouselItem>
            );
          })}

        </CarouselContent>

        <CarouselPrevious
          className="
            dark:bg-gray-800
            dark:border-gray-700
            dark:text-white
            hover:bg-[#6A38C2]
            hover:text-white
            transition-colors
          "
        />

        <CarouselNext
          className="
            dark:bg-gray-800
            dark:border-gray-700
            dark:text-white
            hover:bg-[#6A38C2]
            hover:text-white
            transition-colors
          "
        />

      </Carousel>
    </div>
  );
};

export default CategoryCarousel;