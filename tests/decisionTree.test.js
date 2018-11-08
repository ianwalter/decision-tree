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
          leadsTo: 'Bard'
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
              leadsTo: state => {
                if (state.responses.attribute === 'D') {
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
  const { name, children } = tree.children[0]
  const decisionTree = new DecisionTree(tree)
  const q = decisionTree.next()
  expect(q.name).toBe(name)
  decisionTree.set(name, children[1].key)
  expect(decisionTree.state.responses[name]).toBe(children[1].key)
  decisionTree.next()
  expect(decisionTree.path).toEqual(['state', 'attribute', 'bard'])
})

test('DecisionTree stores responses and traverses a functional lead', () => {
  const decisionTree = new DecisionTree(tree)
  decisionTree.next()
  decisionTree.set('attribute', 'S')
  decisionTree.next()
  decisionTree.set('proficiency', 'S')
  decisionTree.next()
  const fighterPath = ['start', 'attribute', 'proficiency', 'fighter']
  expect(decisionTree.path).toEqual(fighterPath)
  decisionTree.prev()
  decisionTree.set('attribute', 'D')
  decisionTree.next()
  const thiefPath = ['start', 'attribute', 'proficiency', 'thief']
  expect(decisionTree.path).toEqual(thiefPath)
})
