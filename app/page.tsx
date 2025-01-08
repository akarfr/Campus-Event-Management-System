import AddEventDialog from "@/components/AddEventDialog";
import Event from "@/components/Event";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export default async function Home() {
  const currentUser = await getCurrentUser();
  const events = await db.event.findMany({
    include: {
      attendees: {
        select: {
          userId: true,
          status: true,
        },
      },
    },
    orderBy: {
      dateTime: "asc",
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-semibold mb-8">Events</h1>
        {currentUser?.role === "ORGANIZER" && <AddEventDialog />}
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
        {events.map((event) => (
          <Event
            key={event.id}
            id={event.id}
            name={event.name}
            location={event.location}
            type={event.type}
            authenticated={!!currentUser}
            status={event.attendees?.find((e) => e.userId == currentUser?.id)?.status}
            dateTime={event.dateTime}
          />
        ))}
      </div>
    </div>
  );
}
