import { TagsProps } from "../types/boardProps";

export const initialTags: TagsProps[] = [
    { idTag: "1", color: "#D32F2F", nameTag: "Urgente", cardsThatUseIt: [] },
    { idTag: "2", color: "#F57C00", nameTag: "Importante", cardsThatUseIt: [] },
    { idTag: "3", color: "#0288D1", nameTag: "Pendiente", cardsThatUseIt: [] },
    { idTag: "4", color: "#7B1FA2", nameTag: "Revisión", cardsThatUseIt: [] },
    { idTag: "5", color: "#388E3C", nameTag: "Aprobado", cardsThatUseIt: [] },
    { idTag: "6", color: "#C2185B", nameTag: "Rechazado", cardsThatUseIt: [] },
    { idTag: "7", color: "#455A64", nameTag: "En proceso", cardsThatUseIt: [] },
    { idTag: "8", color: "#AFB42B", nameTag: "Finalizado", cardsThatUseIt: [] },
    { idTag: "9", color: "#1976D2", nameTag: "Bloqueado", cardsThatUseIt: [] },
    { idTag: "10", color: "#616161", nameTag: "En espera", cardsThatUseIt: [] }
]

export const initialTagsDemo: TagsProps[] = [
    { idTag: "1", color: "#D32F2F", nameTag: "Urgente", cardsThatUseIt: [
        { idBoard: 'TableroDemo', idList: 'ListaDemo', idCard: 'cardDemoBaño' },
        { idBoard: 'TableroDemo', idList: 'ListaDemo', idCard: 'cardDemoHabitacionPrincipal' }
    ] },
    { idTag: "2", color: "#F57C00", nameTag: "Importante", cardsThatUseIt: [
        { idBoard: 'TableroDemo', idList: 'ListaDemo', idCard: 'cardDemoBaño' }
    ] },
    { idTag: "3", color: "#0288D1", nameTag: "Pendiente", cardsThatUseIt: [
        { idBoard: 'TableroDemo', idList: 'ListaDemo', idCard: 'cardDemoHabitacionNiños' }
    ] },
    { idTag: "4", color: "#7B1FA2", nameTag: "Revisión", cardsThatUseIt: [] },
    { idTag: "5", color: "#388E3C", nameTag: "Aprobado", cardsThatUseIt: [] },
    { idTag: "6", color: "#C2185B", nameTag: "Rechazado", cardsThatUseIt: [] },
    { idTag: "7", color: "#455A64", nameTag: "En proceso", cardsThatUseIt: [] },
    { idTag: "8", color: "#AFB42B", nameTag: "Finalizado", cardsThatUseIt: [] },
    { idTag: "9", color: "#1976D2", nameTag: "Bloqueado", cardsThatUseIt: [] },
    { idTag: "10", color: "#616161", nameTag: "En espera", cardsThatUseIt: [
        { idBoard: 'TableroDemo', idList: 'ListaDemo', idCard: 'cardDemoHabitacionNiños' }
    ] }
];

// const colors = [
//     "#D32F2F",
//     "#F57C00", 
//     "#0288D1", 
//     "#7B1FA2", 
//     "#388E3C", 
//     "#C2185B", 
//     "#455A64", 
//     "#AFB42B", 
//     "#1976D2", 
//     "#616161", 
//     "#E64A19", 
//     "#009688", 
//     "#5D4037", 
//     "#673AB7", 
//     "#FBC02D", 
//     "#9C27B0", 
//     "#3F51B5", 
//     "#8BC34A", 
//     "#E91E63", 
//     "#00BCD4"  
// ];

export const darkTextColors = [
    "#F57C00", // Por hacer
    "#AFB42B", // Completado
    "#FBC02D", // Advertencia
    "#8BC34A", // Bajo control
    "#00BCD4"  // Oportunidad
];

export const lightTextColors = [
    "#D32F2F", // Alta prioridad
    "#0288D1", // En progreso
    "#7B1FA2", // Revisión necesaria
    "#388E3C", // Aprobado
    "#C2185B", // Rechazado
    "#455A64", // Bajo seguimiento
    "#1976D2", // Bloqueado
    "#616161", // Pendiente de aprobación
    "#E64A19", // Urgente
    "#009688", // Idea
    "#5D4037", // Esperando feedback
    "#673AB7", // Investigación
    "#9C27B0", // Concepto
    "#3F51B5", // Revisión interna
    "#E91E63"  // Problema detectado
];

export const betterColorText = (color: string) => {
    return darkTextColors.some(c => c === color) ? '#121212' : '#F8F8F8';
}