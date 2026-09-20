import React from "react";
import { ArrowUpRight, Mic2 } from "lucide-react";

const VOICE_ID_URL = "https://www.voiceid.online/?utm_source=textcase&utm_medium=referral&utm_campaign=voiceid_promotion&utm_content=global_promo";

export default function VoiceIDPromo() {
  return (
    <section
      aria-label="More from the creator"
      className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Mic2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Also from the creator
              </p>
              <h2 className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">
                VoiceID
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                If you need a simple way to connect, message and talk without sharing your phone number, take a look at VoiceID.
              </p>
            </div>
          </div>
          <a
            href={VOICE_ID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
          >
            Explore VoiceID
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
