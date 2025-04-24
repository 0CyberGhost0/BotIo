'use client'

import { useParams } from 'next/navigation'
import EmbedChat from "../../components/EmbedChat";

const EmbedPage =  () => {
  const params = useParams();
  const id = params.botId as string;

  console.log("Bot ID from params:", id);
  
  if (!id) {
    return <div className="text-center p-4 text-red-500">Bot ID is missing</div>;
  }
  
  return (
    <div className="h-screen w-full bg-black">
      <EmbedChat botId={id} />
    </div>
  );
};

export default EmbedPage;
