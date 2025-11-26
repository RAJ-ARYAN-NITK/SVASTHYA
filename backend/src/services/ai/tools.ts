import { FunctionDeclaration, FunctionDeclarationSchemaType } from '@google/generative-ai';

// --- Tool Implementations (Mock) ---

export const toolsImplementation = {
    bookAppointment: (args: any) => {
        console.log('Executing bookAppointment:', args);
        return {
            status: 'success',
            message: `Appointment booked with ${args.doctorName} on ${args.date} for ${args.reason}.`,
            appointmentId: 'APT-' + Math.floor(Math.random() * 10000)
        };
    },
    setMedicationReminder: (args: any) => {
        console.log('Executing setMedicationReminder:', args);
        return {
            status: 'success',
            message: `Reminder set for ${args.medicineName} at ${args.time} (${args.frequency}).`,
            reminderId: 'REM-' + Math.floor(Math.random() * 10000)
        };
    },
    getPatientRecords: (args: any) => {
        console.log('Executing getPatientRecords:', args);
        // Mock data
        return {
            patientName: 'Raj Aryan',
            age: 25,
            conditions: ['Seasonal Allergies'],
            lastVisit: '2023-10-15',
            recentVitals: {
                bp: '120/80',
                heartRate: 72
            }
        };
    }
};

// --- Tool Definitions for Gemini ---

export const toolsDefinition: FunctionDeclaration[] = [
    {
        name: 'bookAppointment',
        description: 'Book a medical appointment with a specific doctor.',
        parameters: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
                doctorName: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'Name of the doctor (e.g., Dr. Smith)',
                },
                date: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'Date and time of the appointment (ISO string or human readable)',
                },
                reason: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'Reason for the visit',
                },
            },
            required: ['doctorName', 'date', 'reason'],
        },
    },
    {
        name: 'setMedicationReminder',
        description: 'Set a reminder for taking medication.',
        parameters: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
                medicineName: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'Name of the medicine',
                },
                time: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'Time to take the medicine',
                },
                frequency: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'How often to take it (e.g., daily, twice a day)',
                },
            },
            required: ['medicineName', 'time'],
        },
    },
    {
        name: 'getPatientRecords',
        description: 'Retrieve the health records of the current patient.',
        parameters: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
                patientId: {
                    type: FunctionDeclarationSchemaType.STRING,
                    description: 'ID of the patient (optional, defaults to current user)',
                },
            },
        },
    },
];
