
import { GenerateActors } from './generateActors';
import test from 'ava';
import { MemoryConceptRepository } from '../memoryConceptRepository';
import { MemoryWikiEntityRepository } from '../memoryWikiEntityRepository';
import { Locale } from '../../types';
import { PushConcepts } from './pushConcepts';
import { ConceptHelper } from '../../entities/conceptHelper';
import { ConceptActor } from '../../entities/actor';

test('ro-md', async t => {
    const conceptRepository = new MemoryConceptRepository();
    const wikiEntityRepository = new MemoryWikiEntityRepository();
    const pushConcepts = new PushConcepts(conceptRepository);
    const locale: Locale = { lang: 'ro', country: 'md' };
    const actorsGenerator = new GenerateActors(locale, conceptRepository, wikiEntityRepository);

    const conceptTexts: string[] = ['R. Moldova', 'Republica Moldova', 'Moldova', 'Republicii Moldova', 'Chișinău', 'Chisinau', 'Chisinaului', 'Adrian Ursu', 'Partidul Liberal', 'PDM', 'Partidul Democrat', 'PSRM'];

    const concepts = conceptTexts
        .map(text => ConceptHelper.create({ text, ...locale }));

    await pushConcepts.execute(concepts);

    const onActor = (actor: ConceptActor) => {
        t.true(!!actor);
        t.true(actor.popularity > 0);
        t.true(actor.slug.length > 1);
        return Promise.resolve();
    };

    await actorsGenerator.execute(onActor);
});
