import test from 'ava'
import DecisionTree from '.'

const proficiency = {
  key: 'proficiency',
  title: 'What type of weapon are you most proficient with?',
  options: [
    {
      key: 'swords',
      label: 'Swords',
      leadsTo: dt => {
        if (dt.state.attribute === 'D') {
          return 'thief'
        } else {
          return 'fighter'
        }
      }
    },
    {
      key: 'bows',
      label: 'Bows',
      leadsTo: 'ranger'
    }
  ],
  children: [
    {
      key: 'fighter',
      title: 'Fighter',
      description: `
        You are a strong fighter, using your sword to cut down those who
        stand in your way!
      `
    },
    {
      key: 'thief',
      title: 'Thief',
      description: `
        You are a dexterous thief, piercing enemies before they even
        know what hit them.
      `
    },
    {
      key: 'ranger',
      title: 'Ranger',
      description: `
        You are a skilled ranger, felling combatants with your arrows.
      `
    }
  ]
}
const attribute = {
  key: 'attribute',
  title: 'What is your greatest attribute?',
  options: [
    {
      key: 'S',
      label: 'Strength',
      leadsTo: 'proficiency'
    },
    {
      key: 'I',
      label: 'Intelligence',
      leadsTo: 'spells'
    },
    {
      key: 'D',
      label: 'Dexterity',
      leadsTo: 'proficiency'
    },
    {
      key: 'C',
      label: 'Charisma',
      leadsTo: 'bard'
    }
  ],
  children: [
    {
      key: 'spells',
      title: 'What are your preffered type of spells?',
      options: [
        {
          key: 'damage',
          label: 'Damage',
          leadsTo: 'mage'
        },
        {
          key: 'healing',
          label: 'Healing',
          leadsTo: 'cleric'
        }
      ],
      children: [
        {
          key: 'mage',
          title: 'Mage',
          description: `
            You are a powerful mage, hurling fireballs at your foes!
          `
        },
        {
          key: 'cleric',
          title: 'Cleric',
          description: `
            You are a knowledgeable cleric, saving your friends by casting
            spells to heal them.
          `
        }
      ]
    },
    proficiency,
    {
      key: 'bard',
      title: 'Bard',
      description: `
        You are a talented bard, inspiring your party with heroic ballads.
      `
    }
  ]
}
const tree = { key: 'start', children: [attribute] }
const fighterPath = ['start', 'attribute', 'proficiency', 'fighter']

test('DecisionTree stores a response and traverses a static lead', t => {
  const decisionTree = new DecisionTree(tree)
  decisionTree.next()
  t.deepEqual(decisionTree.pathKeys(), ['start', 'attribute'])
  const bard = tree.children[0].options[3].key
  decisionTree.set(tree.children[0].key, bard)
  t.is(decisionTree.state[tree.children[0].key], bard)
  decisionTree.next()
  t.deepEqual(decisionTree.pathKeys(), ['start', 'attribute', 'bard'])
})

test('DecisionTree stores state and traverses a functional lead', t => {
  const decisionTree = new DecisionTree(tree)
  decisionTree.next()
  decisionTree.set('attribute', 'S').next()
  decisionTree.set('proficiency', 'swords').next()
  t.deepEqual(decisionTree.pathKeys(), fighterPath)
  decisionTree.prev()
  decisionTree.set('attribute', 'D').next()
  const thiefPath = ['start', 'attribute', 'proficiency', 'thief']
  t.deepEqual(decisionTree.pathKeys(), thiefPath)
})

test('DecisionTree can be instantiated with path and state', t => {
  const path = [tree, attribute, proficiency]
  const state = { attribute: 'S', proficiency: 'swords' }
  const decisionTree = new DecisionTree(tree, path, state)
  decisionTree.next()
  t.deepEqual(decisionTree.pathKeys(), fighterPath)
})
