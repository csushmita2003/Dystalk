import { useState } from "react";
import { AudioManager } from "./AudioManager";
import Transcript from "./Transcript";
import { useTranscriber } from "../hooks/useTranscriber";

const TranscribePage = () => {
  const transcriber = useTranscriber();

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Transcribe Dysarthric Speech</h1>
      
      <AudioManager transcriber={transcriber} />
      <Transcript transcribedData={transcriber.output} />
    </div>
  );
};

export default TranscribePage;
