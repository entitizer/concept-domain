
import test from 'ava';
import { MemoryConceptRepository } from '../memoryConceptRepository';
import { MemoryWikiEntityRepository } from '../memoryWikiEntityRepository';
import { Locale } from '../../types';
import { ExploreWikiEntities } from './exploreWikiEntities';
import { ConceptHelper } from '../../entities/conceptHelper';
import { PushConcepts } from './pushConcepts';

test('ro-md', async t => {
    const conceptRepository = new MemoryConceptRepository();
    const wikiEntityRepository = new MemoryWikiEntityRepository();
    const pushConcepts = new PushConcepts(conceptRepository);
    const locale: Locale = { lang: 'ro', country: 'md' };
    const exploreWikiEntities = new ExploreWikiEntities(locale, conceptRepository, wikiEntityRepository);

    const conceptTexts: string[] = ['R. Moldova', 'Chișinău'];

    const concepts = conceptTexts
        .map(text => ConceptHelper.create({ text, ...locale }));

    await pushConcepts.execute(concepts);

    t.is(await wikiEntityRepository.count(), 0, 'no wiki entities in DB');

    await exploreWikiEntities.execute(null);

    let countEntities = await wikiEntityRepository.count();

    t.log(`count entities=${countEntities}`);

    t.true(countEntities > 0, 'many wiki entities in DB');
});
