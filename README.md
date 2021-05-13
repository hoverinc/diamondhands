## Diamondhands

React JS designed around the desire to write code such as:
```
<span>{ user.fullName.value() }</span>
``` 
🔮 or 🪄
```
<span>{ user.fullName.edit() }</span>
```

Inspired by [stimulus](https://github.com/hotwired/stimulus).

## Suggested JS folder structure
#### `// app/javascript/app/...`

JS strucure is suggested to mirror what one would typically find in a Rails app as much as possible. The models, controllers, views of JS are a different beast, but the MVC style division of labor can be the same.

This convention should speed up development by abstracting such things as validations into JS model files, and API requests into controller files. In addition none of the view or model files will contain and request response logic. And the controllers and views should contain no validation logic. The hypothesis is that this will clean up development for the average person on a team by not having to deal with controller API requests or validations at the same time as interacting with the views, which is normally the case in React codebases. The views may just contain `<span>{ user.fullName.value() }</span>` or `<span>{ user.fullName.edit() }</span>` for example to render a self-saving editiable input. 
<br />
<br />

### Models
For handling data and business logic. <br /><br />

### Views
For handling graphical user interface objects and presentation. <br />
#### `// app/javascript/app/views/...`

`/html` <br />
This folder is intended to store bits of html & css without any interactivity or other <br />
functionality. All html & css or `styled_components` should be in this folder.

`/atoms` <br />
This folder is intended to import html & css components from the html folder and add <br />
very simple pieces of functionality. Atoms can only contain one piece of state, one value.

`/molecules` <br />
This folder contains traditional React components. Components here are intended to import <br /> 
pieces of functionality from the atoms folder and combine them into re-usable route components.

`/routes` <br />
This folder is intended to import from the atoms & molecules folders and contain the root <br />
javascript file for each individual url of the application.
<br />
<br />

### Controllers
Handle the request response logic. Graphql queries will be defined and composed in the controllers.
<br />
<br />


## Other features

`store.ts` contains a simplified reducer to handle all state in the application. Store keys 🗝 are generated automatically in `resolver.ts` or can be added manually to components that want to talk to the store. You can talk to the store manually via:
```
import { store } from "diamondhands";

store.set({
  someKey: {
    nested: "🧞‍♀️"
  }
});
//...
store.get("someKey.nested");
```

This example is automatically associated with a model:
```
import React from "react";
import user from "app/models/user.ts";

class Input extends Atom {
  constructor(props) {
    super({
      ...props,
      model: user
    });
  }
}
```
This component is using the store for whtever it wants with its file path as a key 🗝:
```
class Header extends Molecule {
  constructor(props) {
    super({
      ...props,
      storeKey: "views.molecules.Header"
    });
  }
}
```
The Store key should always be the path to the file within the javascript application (`"views.atoms.Input"`). TODO: Add some validation around this.
<br />
<br />
Example controller:
```
import ApolloController from "../../lib/diamondhands/ApolloController";
import { GetJobs } from "./generated/graphql";

class JobsController extends ApolloController {
  accessor() {
    return "jobs";
  }

  index() {
    return GetJobs;
  }
}
```

Examle model:
```
import Model from "lib/diamondhands/Model"
import JobsController from "app/controllers/JobsController";

class Job extends Model {
  constructor() {
    super();

    this.controller = new JobsController();
  }

  name() {
    return "jobs";
  }

  resolvers() {
    return [{
      attr: "index"
    }];
  }
}

export default new Job;
```

Debugging diamondhands should be easy to do. Other existing libraries have been avoided intentionally in diamondhands to keep debugging as simple and strightforward as possible, without getting lost in other people's code. Libraries can be heavily abstracted in some cases for issues that we may not even have, or are not trying to handle.

#### Data flow

- `Muon` handles client store <-> atom state
- `Proton` handles server <-> client store state
- Rails controllers (empty) -> `erb` files (empty) -> React router (see `routes.ts`) -> `app/views/routes`
- Routes -> Molecules -> Atoms (single piece of state)
- Atom components -> `resolver.ts` -> `Muon#quark` -> controller action
- Model files define what attrs are available, and controller files define the graphql to access that data.

- You can also make calls directly from methods generated on the model.
```
import search from "app/models/search";

class SearchAnything extends React.Component {
  ...
  private searchJobs = () => {
    search.anything.query({ search_term: this.state.searchTerm });
  }
}
```

Models are given lowercase filenames, as they export an instance `export default new Job;` Controllers are always referenced via the model, where they are instantiated.

#### Logging

🚏 Router props: {env: {…}} <br />
🧬 Quark attr: fullName <br />
🧩 Fetching... <br />
🌀 Starting get from server... user <br />
🎩 Server: http://localhost:3000  <br />
🍱 Store state: {serverProps: {…}} <br />
🦭 Server sha: 7ffcba4c7df7cd6fb99d5fcf96dda146ddec3768 <br />
📜 Response: {profile: {…}} <br />
🧩 Fetched Justin Ancherh <br />
