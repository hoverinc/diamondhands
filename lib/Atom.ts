import React from "react";
import store from "lib/diamondhands/store";
import Proton from "./Proton";

class Atom extends Proton {
  constructor(props) {
    super(props);

    if (props.molecule) return;

    if ( Object.keys(this.state).length !== 1 ) {
      error("↳ ⚛ Atoms can only have once piece of state. ⚛");
      log("dev", this);
    }
  }
}

export default Atom;
