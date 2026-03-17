import { Appointment } from "../types";

export const isConflict = (nextAppointment: Appointment, existingAppointments: Appointment[]): boolean => {
  return existingAppointments.some((appointment) => {
    if (
      appointment.employeeId !== nextAppointment.employeeId ||
      appointment.date !== nextAppointment.date
    ) {
      return false;
    }

    const nextStart = nextAppointment.start;
    const nextEnd = nextAppointment.end;
    const currentStart = appointment.start;
    const currentEnd = appointment.end;

    return nextStart < currentEnd && currentStart < nextEnd;
  });
};
