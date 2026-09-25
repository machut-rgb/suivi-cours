import { Config } from 'ziggy-js';

export type Role = 'responsable' | 'delegue';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    classe_id: number | null;
    approved_at: string | null;
    email_verified_at?: string;
}

export interface Parcours {
    id: number;
    name: string;
    classes?: Classe[];
}

export interface Classe {
    id: number;
    name: string;
    parcours_id: number;
    parcours?: Parcours;
    matieres?: Matiere[];
    users_count?: number;
}

export interface Matiere {
    id: number;
    name: string;
    classe_id: number;
    classe?: Classe;
}

export interface Activite {
    id: number;
    note: string;
    date: string;
    chapitre_id: number;
    user_id: number;
    user?: Pick<User, 'id' | 'name'>;
    chapitre?: Chapitre;
    created_at: string;
}

export interface Chapitre {
    id: number;
    title: string;
    isFinished: boolean;
    finished_at: string | null;
    programme_id: number;
    activites?: Activite[];
    programme?: Programme;
}

export interface MonthlyPoint {
    month: string;
    progression: number;
    finished: number;
    total: number;
    activities: number;
}

export interface Programme {
    id: number;
    name: string;
    matiere_id: number;
    matiere: Matiere;
    chapitres: Chapitre[];
    progression: number;
    monthly?: MonthlyPoint[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
    ziggy: Config & { location: string };
};
