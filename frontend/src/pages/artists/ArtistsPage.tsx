import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music2, Star } from "lucide-react";
import BollywoodArtists from "./components/BollywoodArtists";
import HollywoodArtists from "./components/HollywoodArtists";
import BhojpuriArtists from "./components/BhojpuriArtists";

const ArtistsPage = () => {
  const [selectedTab, setSelectedTab] = useState("bollywood");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-2">
        <Star className="text-primary" />
        Featured Artists
      </h1>

      <Tabs defaultValue="bollywood" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="bollywood" className="data-[state=active]:bg-zinc-700">
            <Music2 className="mr-2 size-4" />
            Bollywood Artists
          </TabsTrigger>
          <TabsTrigger value="hollywood" className="data-[state=active]:bg-zinc-700">
            <Music2 className="mr-2 size-4" />
            Hollywood Artists
          </TabsTrigger>
          <TabsTrigger value="bhojpuri" className="data-[state=active]:bg-zinc-700">
            <Music2 className="mr-2 size-4" />
            Bhojpuri Artists
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-250px)]">
          <TabsContent value="bollywood" className="space-y-8">
            <BollywoodArtists />
          </TabsContent>
          <TabsContent value="hollywood" className="space-y-8">
            <HollywoodArtists />
          </TabsContent>
          <TabsContent value="bhojpuri" className="space-y-8">
            <BhojpuriArtists />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ArtistsPage; 