
import { IWriteRepository, IReadRepository } from '@textactor/domain';
import { IConcept } from '../entities/concept';
import { ILocale } from '../types';

export type PopularConceptHash = {
    hash: string
    ids: string[]
    popularity: number
}

export interface IConceptWriteRepository extends IWriteRepository<string, IConcept> {
    deleteUnpopular(locale: ILocale, popularity: number): Promise<number>
    deleteUnpopularAbbreviations(locale: ILocale, popularity: number): Promise<number>
    deleteUnpopularOneWorlds(locale: ILocale, popularity: number): Promise<number>
    deleteAll(locale: ILocale): Promise<number>
    deleteIds(ids: string[]): Promise<number>
    incrementPopularity(id: string): Promise<number>
    createOrIncrementPopularity(concept: IConcept): Promise<IConcept>
}

export interface IConceptReadRepository extends IReadRepository<string, IConcept> {
    getByTextHash(hash: string): Promise<IConcept[]>
    getByRootTextHash(hash: string): Promise<IConcept[]>
    getPopularRootTextHashes(locale: ILocale, limit: number): Promise<PopularConceptHash[]>
}

export interface IConceptRepository extends IConceptReadRepository, IConceptWriteRepository {

}