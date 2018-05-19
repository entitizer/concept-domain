import { ConceptContainer, ConceptContainerStatus } from "./conceptContainer";
import { generate as generateNewId } from 'shortid';

export type ConceptContainerKnownData = {
    lang: string
    country: string
    name: string
    uniqueName: string
    ownerId: string
}

export class ConceptContainerHelper {
    static build(data: ConceptContainerKnownData): ConceptContainer {
        const container: ConceptContainer = {
            id: generateNewId(),
            status: ConceptContainerStatus.NEW,
            name: data.name,
            uniqueName: data.uniqueName,
            lang: data.lang,
            country: data.country,
            ownerId: data.ownerId,
        };

        return container;
    }

    static canStartCollect(status: ConceptContainerStatus) {
        return [ConceptContainerStatus.NEW,
        ConceptContainerStatus.COLLECT_ERROR,
        ConceptContainerStatus.COLLECT_DONE,
        ConceptContainerStatus.COLLECTING]
            .indexOf(status) > -1;
    }

    static canStartGenerate(status: ConceptContainerStatus) {
        return [ConceptContainerStatus.COLLECT_DONE,
        ConceptContainerStatus.GENERATE_ERROR]
            .indexOf(status) > -1;
    }
}
