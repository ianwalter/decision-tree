const DecisionTree = require('../')

const tree = {
  key: 'start',
  children: [
    {
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
              description: ''
            },
            {
              key: 'cleric',
              title: 'Cleric',
              description: ''
            }
          ]
        },
        {
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
              description: ''
            },
            {
              key: 'thief',
              title: 'Thief',
              description: ''
            },
            {
              key: 'ranger',
              title: 'Ranger',
              description: ''
            }
          ]
        },
        {
          key: 'bard',
          title: 'Bard',
          description: ''
        }
      ]
    }
  ]
}

test('DecisionTree stores a response and traverses a static lead', () => {
  const decisionTree = new DecisionTree(tree)
  decisionTree.next()
  expect(decisionTree.pathKeys()).toEqual(['start', 'attribute'])
  const bard = tree.children[0].options[3].key
  decisionTree.set(tree.children[0].key, bard)
  expect(decisionTree.state[tree.children[0].key]).toBe(bard)
  decisionTree.next()
  expect(decisionTree.pathKeys()).toEqual(['start', 'attribute', 'bard'])
})

test('DecisionTree stores state and traverses a functional lead', () => {
  const decisionTree = new DecisionTree(tree)
  decisionTree.next()
  decisionTree.set('attribute', 'S')
  decisionTree.next()
  decisionTree.set('proficiency', 'swords')
  decisionTree.next()
  const fighterPath = ['start', 'attribute', 'proficiency', 'fighter']
  expect(decisionTree.pathKeys()).toEqual(fighterPath)
  decisionTree.prev()
  decisionTree.set('attribute', 'D')
  decisionTree.next()
  const thiefPath = ['start', 'attribute', 'proficiency', 'thief']
  expect(decisionTree.pathKeys()).toEqual(thiefPath)
})
