import weeklyMealPlan from "@/data/weekly-meal-plan.json";

export type Meal = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type MealPlanDay = {
  date: string;
  day: string;
  meals: Meal;
};

export type MealPlanWeek = {
  week: string;
  days: MealPlanDay[];
};

export function getWeeklyMealPlan(): MealPlanWeek {
  return weeklyMealPlan;
}
