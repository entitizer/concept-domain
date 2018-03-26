
import { UseCase } from '@textactor/domain';
import { IActor } from '../entities';
import { ILocale } from '../types';
import { IWikiEntityRepository } from './wikiEntityRepository';
import { IConceptRepository } from './conceptRepository';
import { BuildActor, GetPopularConceptNode, DeleteActorConcepts } from './actions';

export interface OnGenerateActorCallback {
    (actor: IActor): Promise<void>
}

export class GenerateActors extends UseCase<OnGenerateActorCallback, void, void> {
    private buildActor:BuildActor
    private getPopularConceptNode:GetPopularConceptNode
    private deleteActorConcepts:DeleteActorConcepts

    constructor(private locale: ILocale, private conceptRepository: IConceptRepository, private wikiEntityRepository: IWikiEntityRepository) {
        super()
        
        this.buildActor = new BuildActor(this.locale, this.wikiEntityRepository, this.conceptRepository);
        this.getPopularConceptNode = new GetPopularConceptNode(this.locale, this.conceptRepository);
        this.deleteActorConcepts = new DeleteActorConcepts(this.conceptRepository);
    }

    protected async innerExecute(callback: OnGenerateActorCallback): Promise<void> {
        let actor: IActor;

        while (true) {
            try {
                const node = await this.getPopularConceptNode.execute(null);

                if (!node) {
                    await this.conceptRepository.deleteAll(this.locale);
                    return;
                }

                actor = await this.buildActor.execute(node);
                await this.deleteActorConcepts.execute(actor);

            } catch (e) {
                return Promise.reject(e);
            }

            if (callback) {
                await callback(actor);
            }
        }
    }
}
