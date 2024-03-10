import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { Creator } from "@/lib/interfaces";
import { Card, CardTitle, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";

export default function FanPageDiscover({ Creators }: { Creators: Creator[] }) {
  return (
    <>
      <div className="px-5 py-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Trending Creators
        </h2>
        <p className="text-sm text-muted-foreground">
          Trending Creators we'd think you'd like!
        </p>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-">
            <div className="flex space-x-4 pb-1">
              {Creators.map((creator: Creator, index) => (
                <TrendingCreators creator={creator} index={index} />
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Separator className="my-4" />
        <h2 className="text-2xl font-semibold tracking-tight">Top Creators</h2>
        <p className="text-sm text-muted-foreground">
          The Top 3 Creators on the platform
        </p>
        <div className="flex flex-row justify-between items-center w-full p-4 overflow-x-auto">
          {Creators.slice(0, 3).map((creator: Creator, index) => (
            <TopCreators creator={creator} index={index}></TopCreators>
          ))}
        </div>
      </div>
    </>
  );
}

function TrendingCreators({
  creator,
  index,
}: {
  creator: Creator;
  index: number;
}) {
  function capitalizeName(name: string) {
    return name
      .split(" ") // Split the name into parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
      .join(" "); // Join the parts back together
  }
  return (
    <Card
      key={index}
      className="flex flex-col items-center flex-shrink-0 p-4" // Added padding and flex column layout
      style={{ width: "300px", minHeight: "200px" }} // Adjusted width and added minHeight
    >
      <img
        src={creator.image || "https://via.placeholder.com/150"}
        alt={creator.name}
        className="w-25 h-25 object-cover rounded-full mx-auto my-3" // Increased size, added margin, and centered
      />
      <CardTitle className="text-center">
        {capitalizeName(creator.name)}
      </CardTitle>
      <CardContent className="flex items-center justify-center space-x-4 pt-3">
        <div>
          <p>{creator.bond!.principal_fee} XTZ</p>
        </div>
        <div>
          <p>{(creator.bond!.revenue_share * 100).toFixed(2)}%</p>
        </div>
        <div>
          <p>{creator.bond!.coupon_interval} Months</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TopCreators({ creator, index }: { creator: Creator; index: number }) {
  function capitalizeName(name: string) {
    return name
      .split(" ") // Split the name into parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
      .join(" "); // Join the parts back together
  }
  return (
    <div
      key={index}
      className="flex-none"
      style={{ minWidth: "350px", marginRight: "20px" }}
    >
      <Card
        className="flex flex-col justify-between items-center flex-shrink-0 p-10 gap-4"
        style={{ minHeight: "300px" }} // Removed fixed width here to apply it to the wrapping div
      >
        <div className="flex flex-row justify-between items-center w-full">
          <img
            src={creator.image || "https://via.placeholder.com/150"}
            alt={creator.name}
            className="w-25 h-25 object-cover rounded-full"
          />
          <div className="flex flex-col justify-center">
            <CardTitle className="text-center">
              {capitalizeName(creator.name)}
            </CardTitle>
            <CardContent className="text-center pt-3">
              <p>{creator.bond!.principal_fee} XTZ</p>
              <p>{(creator.bond!.revenue_share * 100).toFixed(2)}%</p>
              <p>{creator.bond!.coupon_interval} Months</p>
            </CardContent>
          </div>
        </div>
        <Progress
          value={Math.floor(Math.random() * 100) + 1}
          className="w-full"
        />
      </Card>
    </div>
  );
}
