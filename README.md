# @ianwalter/decision-tree
> A utility for traversing decision trees by selecting options

[![npm page][npmImage]][npmUrl]
[![CI][ciImage]][ciUrl]

## Resources

* [Spotlight on decision-tree blog post][postUrl]

## Installation

```console
yarn add @ianwalter/decision-tree
```

## Usage

```js
import { DecisionTree } from '@ianwalter/decision-tree'

const decisionTree = new DecisionTree({
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
    },
    {
      key: 'bard',
      title: 'Bard',
      description: `
        You are a talented bard, inspiring your party with heroic ballads.
      `
    }
  ]
})

decisionTree.set('attribute', 'D').next()
decisionTree.set('proficiency', 'swords').next()
decisionTree.current() /* => {
  key: 'thief',
  title: 'Thief',
  description: `
    You are a dexterous thief, piercing enemies before they even
    know what hit them.
  `
}
*/
```

## API

### Instance methods

```js
// Set a value (selected option / answer) for a question.
decisionTree.set(key, value)

// Return the current node (the last node in the path).
decisionTree.current()

// Append the given node to the path, making it the current node.
decisionTree.goToNode(node)

// Determine the next node to move to by handling the selected option's leadsTo
// property/method.
decisionTree.getNodeFromLeadsTo(currentNode, selectedOption)

// Continue to the next node.
decisionTree.next()

// Go back to the previous node in the path.
decisionTree.prev()

// Return the branch/path as an array of ordered node keys.
decisionTree.pathKeys()
```

### Errors

```js
import { 
  // There are no children to navigate to when calling next.
  NoChildrenError,
  // The next node to navigate to can't be determined when calling next.
  NoLeadsToError,
  // There is no parent to navigate to when calling prev.
  NoParentError 
} from '@ianwalter/decision-tree'
```

## @ianwalter/decision-tree for enterprise

Available as part of the Tidelift Subscription

The maintainers of @ianwalter/decision-tree and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-ianwalter-decision-tree?utm_source=npm-ianwalter-decision-tree&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

## License

Hippocratic License - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://ianwalter.dev)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/decision-tree.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/decision-tree
[ciImage]: https://github.com/ianwalter/decision-tree/workflows/CI/badge.svg
[ciUrl]: https://github.com/ianwalter/decision-tree/actions
[postUrl]: https://ianwalter.dev/spotlight-on-decision-tree
[licenseUrl]: https://github.com/ianwalter/decision-tree/blob/master/LICENSE
