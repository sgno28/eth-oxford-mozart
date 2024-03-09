import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";

import { AlbumArtwork } from "@/ui/album-artwork";

import { listenNowAlbums, madeForYouAlbums } from "../../data/albums";

export default function FanPage() {
  return (
    <>
      <div className="px-5 py-2 ">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Trending Creators
            </h2>
            <p className="text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
            <ScrollArea>
              <div className="flex space-x-4 pb-4">CREATOR CARDS GO HERE</div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
        <Separator className="my-4" />
      </div>
    </>
  );
}
