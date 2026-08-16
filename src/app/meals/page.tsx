import { getWeeklyMealPlan } from "@/lib/meal-plan";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

export default function MealsPage() {
  const { week, days } = getWeeklyMealPlan();
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });

  return (
    <div className="flex flex-1 flex-col items-center bg-region-surface px-6 py-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-h1 text-foreground">주간 식단표</h1>
        <p className="mt-1 text-caption text-secondary">{week} 주간</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <StatCard label="이번 주 일수" value={`${days.length}일`} />
          <StatCard
            label="등록된 식사"
            value={`${days.length * 3}끼`}
            delta="아침·점심·저녁"
          />
        </div>

        <Card className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-body">
            <thead>
              <tr className="border-b border-hairline bg-surface">
                <th className="px-4 py-3 font-medium text-secondary">요일</th>
                <th className="px-4 py-3 font-medium text-secondary">아침</th>
                <th className="px-4 py-3 font-medium text-secondary">점심</th>
                <th className="px-4 py-3 font-medium text-secondary">저녁</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr
                  key={day.date}
                  className="border-b border-hairline last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {day.day}
                      <span className="text-caption text-secondary">
                        {day.date}
                      </span>
                      {day.date === today && (
                        <Badge variant="success">오늘</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{day.meals.breakfast}</td>
                  <td className="px-4 py-3">{day.meals.lunch}</td>
                  <td className="px-4 py-3">{day.meals.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
