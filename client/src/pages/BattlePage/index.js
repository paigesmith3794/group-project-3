import React, { Component } from "react";
import { Redirect } from "react-router-dom";
//Development source for characters
import characters from "../../characters";
import Fighter from "../../components/Fighter";
import MessageBox from "../../components/MessageBox";
import Navbar from "../../components/Navbar";
import "./style.css";

export default class BattlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: characters,
      state: 0,
      message: "Fight!!!"
    };
  }

  //Handles interaction between characters
  handleAttack = (atkId, defId) => {
    var newCharacters = this.state.characters;
    var atk, def;

    for (let i = 0; i < newCharacters.length; i++) {
      if (newCharacters[i].id === atkId) {
        atk = newCharacters[i];
      } else if (newCharacters[i].id === defId) {
        def = newCharacters[i];
      }
    }

    if (atk.health > 0 && def.health > 0) {
      for (let i = 0; i < newCharacters.length; i++) {
        if (newCharacters[i].id === defId) {
          //Check for dodge
          var defDodge = Math.floor(Math.random() * 100) + 1;
          var defDamage = atk.attack;
          if (defDodge < newCharacters[i].agility) {
            defDamage = 1;
          }
          newCharacters[i].health -= defDamage;
          if (newCharacters[i].health < 0) {
            newCharacters[i].health = 0;
          }
        }
        if (newCharacters[i].id === atkId) {
          //Check for dodge
          var atkDodge = Math.floor(Math.random() * 100) + 1;
          var atkDamage = def.attack;
          if (atkDodge < newCharacters[i].agility) {
            atkDamage = 1;
          }
          newCharacters[i].health -= atkDamage;
          if (newCharacters[i].health < 0) {
            newCharacters[i].health = 0;
          }
        }
      }
    } else {
      if (atk.health > def.health) {
        this.winner("Enemy vanquished!");
      } else {
        this.winner("The foe has won...");
      }
    }

    this.setState({
      characters: newCharacters
    });
  };

  winner = name => {
    this.setState({
      message: name
    });
    setTimeout(() => {
      window.location.pathname = "/character";
    }, 2000);
  };

  render() {
    if (!this.props.user) return <Redirect to="/login" />;
    if (this.props.player === undefined) return <Redirect to="/character" />;
    return (
      <div className="battle-page">
        <Navbar user={this.props.user} view="battle" />
        <h1>BattlePage</h1>
        <div id="battle-bg" className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 text-center">
              <Fighter
                name={characters[this.props.player - 1].name}
                key={characters[this.props.player - 1].id}
                id={characters[this.props.player - 1].id}
                image={characters[this.props.player - 1].image}
                health={characters[this.props.player - 1].health}
                maxHealth={characters[this.props.player - 1].maxHealth}
                attack={characters[this.props.player - 1].attack}
                defense={characters[this.props.player - 1].defense}
                agility={characters[this.props.player - 1].agility}
                target={characters[this.props.enemy - 1].id}
                handleAttack={this.handleAttack}
              />
            </div>
            <div className="col-md-6 text-center">
              <Fighter
                name={characters[this.props.enemy - 1].name}
                key={characters[this.props.enemy - 1].id}
                id={characters[this.props.enemy - 1].id}
                image={characters[this.props.enemy - 1].image}
                health={characters[this.props.enemy - 1].health}
                maxHealth={characters[this.props.enemy - 1].maxHealth}
                attack={characters[this.props.enemy - 1].attack}
                defense={characters[this.props.enemy - 1].defense}
                agility={characters[this.props.enemy - 1].agility}
                target={characters[this.props.player - 1].id}
              />
            </div>
          </div>
          <MessageBox message={this.state.message} />
        </div>
      </div>
    );
  }
}
