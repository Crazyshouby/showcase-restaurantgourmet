
import { GoogleCalendarAuthService } from './auth-service';
import { GoogleCalendarEventsService } from './events';
import { getAdminSettings } from './utils';
import { GoogleCalendarSettings, GoogleCalendarEvent, GoogleCalendarAuthResponse, GoogleCalendarEventResponse, SyncResponse } from './types';

/**
 * Service principal pour l'intégration avec Google Calendar.
 * Fournit toutes les fonctionnalités pour gérer la connexion, les événements et la synchronisation.
 */
export class GoogleCalendarService {
  // Méthodes d'authentification
  static isConnected = GoogleCalendarAuthService.isConnected;
  static connect = GoogleCalendarAuthService.connect;
  static disconnect = GoogleCalendarAuthService.disconnect;
  
  // Méthodes d'événements
  static createEvent = GoogleCalendarEventsService.createEvent;
  static updateEvent = GoogleCalendarEventsService.updateEvent;
  static getEvents = GoogleCalendarEventsService.getEvents;
  static convertEventsToReservations = GoogleCalendarEventsService.convertEventsToReservations;
  static deleteEvent = GoogleCalendarEventsService.deleteEvent;
  
  // Méthodes utilitaires
  static getAdminSettings = getAdminSettings;
}

// Export des types pour une utilisation externe
export type {
  GoogleCalendarSettings,
  GoogleCalendarEvent,
  GoogleCalendarAuthResponse,
  GoogleCalendarEventResponse,
  SyncResponse
};
