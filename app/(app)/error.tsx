"use client";

import { FeedError } from "@/components/feed/FeedStates";

export default function Error({ error }: { error: Error }) {
  return <FeedError message={error.message} />;
}
