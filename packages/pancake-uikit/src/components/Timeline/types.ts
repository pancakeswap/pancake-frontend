export type EventStatus = "past" | "live" | "upcoming";

export type Event = {
  status: EventStatus;
  text: string;
  altText?: string;
  infoText?: string;
};

export type TimelineProps = {
  events: Event[];
};
