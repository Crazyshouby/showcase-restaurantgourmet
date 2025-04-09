
import React, { useState } from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Event } from "@/types/events";
import EventDialog from "../EventDialog";
import EventForm from "../EventForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EventCard from "./EventCard";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-muted/20">
        <p className="text-lg text-muted-foreground">Aucun événement trouvé</p>
      </div>
    );
  }

  const handleDeleteConfirm = async (eventId: string) => {
    if (!eventId) {
      console.error("Tentative de suppression avec un ID invalide");
      return;
    }
    
    try {
      setIsDeletingEvent(true);
      console.log("Confirmation de suppression de l'événement:", eventId);
      
      // Appel à la fonction de suppression
      onDeleteEvent(eventId);
      
      // Attendre un court délai avant de fermer le dialogue
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Erreur lors de la confirmation de suppression:", error);
    } finally {
      setIsDeletingEvent(false);
      setDeletingEventId(null);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    console.log("Configuration de deletingEventId à:", eventId);
    setDeletingEventId(eventId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id}
          event={event}
          onEdit={() => setEditingEvent(event)}
          onDeleteClick={handleDeleteClick}
        />
      ))}

      {/* Dialog pour l'édition */}
      <EventDialog 
        isOpen={!!editingEvent} 
        onOpenChange={(open) => !open && setEditingEvent(null)}
        title="Modifier l'événement"
        description="Modifiez les informations de l'événement."
      >
        {editingEvent && (
          <EventForm 
            initialData={editingEvent}
            onSubmit={(formData) => {
              onUpdateEvent({ ...formData, id: editingEvent.id });
              setEditingEvent(null);
            }}
            onCancel={() => setEditingEvent(null)}
          />
        )}
      </EventDialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog 
        open={deletingEventId !== null} 
        onOpenChange={(open) => !open && setDeletingEventId(null)}
      >
        <AlertDialogTrigger className="hidden" />
        {deletingEventId && (
          <DeleteConfirmationDialog 
            eventTitle={events.find(e => e.id === deletingEventId)?.title || ""}
            onConfirm={() => handleDeleteConfirm(deletingEventId)}
            isLoading={isDeletingEvent}
          />
        )}
      </AlertDialog>
    </div>
  );
};

export default EventsList;
