import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../../../utils/supabaseClient";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

export const useRealtimeComments = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    const channel: RealtimeChannel = supabaseClient
      .channel(`realtime-comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("Realtime update received:", payload);

          // invalidate the React Query managed cache to trigger a re-fetch
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        }
      )
      .subscribe();

    // cleanup subscription on unmount
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [postId, queryClient]);
};
