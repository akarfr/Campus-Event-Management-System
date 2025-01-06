import AddEventDialog from "@/components/AddEventDialog";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export default async function Home() {
  const currentUser = await getCurrentUser();
  const events = await db.event.findMany();

  return (
    <div className="p-8">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-semibold">Events</h1>
        {currentUser?.role === "ORGANIZER" && <AddEventDialog />}
      </div>
      <div>
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg my-4">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-gray-500">{event.location}</p>
            <p className="text-gray-500">{event.dateTime.toLocaleString()}</p>
            <p className="text-gray-500">{event.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
