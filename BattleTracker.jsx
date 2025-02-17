import React, { useState } from 'react';
import { Heart, Edit, X, Skull } from 'lucide-react';

const BattleTracker = () => {
  // ---------------------------
  // Party Character State
  // ---------------------------
  const [characters, setCharacters] = useState([
    {
      id: 1,
      name: "Jory",
      class: "Dragonborn Cleric",
      health: 100,
      maxHealth: 100,
      effects: [],
      status: [],
      inventory: ["Mace", "Shield", "Holy Symbol"],
      position: "front",
    },
    {
      id: 2,
      name: "Valiant",
      class: "Aarakocra Wizard",
      health: 80,
      maxHealth: 80,
      effects: [],
      status: [],
      inventory: ["Staff", "Spellbook"],
      position: "back",
    },
    {
      id: 3,
      name: "Dahlia",
      class: "Changeling Rogue",
      health: 90,
      maxHealth: 90,
      effects: [],
      status: [],
      inventory: ["Bow", "Arrows (100)", "Rapier"],
      position: "mid",
    },
  ]);

  // ---------------------------
  // Enemy State
  // ---------------------------
  const [enemies, setEnemies] = useState([]);

  // ---------------------------
  // Editing State
  // ---------------------------
  const [editingChar, setEditingChar] = useState(null);

  // ---------------------------
  // UI/Temporary Inputs
  // ---------------------------
  const [newItem, setNewItem] = useState("");
  const [damageAmount, setDamageAmount] = useState(10);
  const [healAmount, setHealAmount] = useState(10);
  const [newEffect, setNewEffect] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // -------------------------------------------
  // Helper Functions for Party Character
  // -------------------------------------------
  const startEditing = (char) => {
    setEditingChar({ ...char }); // Copy the character into editing state
  };

  const saveCharacter = () => {
    if (!editingChar) return;
    setCharacters((prev) =>
      prev.map((c) => (c.id === editingChar.id ? editingChar : c))
    );
    setEditingChar(null);
  };

  const adjustHealth = (charId, amount) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          const updatedHealth = Math.min(
            c.maxHealth,
            Math.max(0, c.health + amount)
          );
          return { ...c, health: updatedHealth };
        }
        return c;
      })
    );
  };

  const addStatus = (charId, statusText) => {
    if (!statusText) return; // don't add if empty
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          return { ...c, status: [...c.status, statusText] };
        }
        return c;
      })
    );
    setNewStatus("");
  };

  const removeStatus = (charId, statusIndex) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          const updatedStatus = [...c.status];
          updatedStatus.splice(statusIndex, 1);
          return { ...c, status: updatedStatus };
        }
        return c;
      })
    );
  };

  const addEffect = (charId, effectText) => {
    if (!effectText) return;
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          return { ...c, effects: [...c.effects, effectText] };
        }
        return c;
      })
    );
    setNewEffect("");
  };

  const removeEffect = (charId, effectIndex) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          const updatedEffects = [...c.effects];
          updatedEffects.splice(effectIndex, 1);
          return { ...c, effects: updatedEffects };
        }
        return c;
      })
    );
  };

  const addInventoryItem = (charId) => {
    if (!newItem) return;
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          return { ...c, inventory: [...c.inventory, newItem] };
        }
        return c;
      })
    );
    setNewItem("");
  };

  const removeInventoryItem = (charId, itemIndex) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id === charId) {
          const updatedInv = [...c.inventory];
          updatedInv.splice(itemIndex, 1);
          return { ...c, inventory: updatedInv };
        }
        return c;
      })
    );
  };

  // -------------------------------------------
  // Helper Functions for Enemies
  // -------------------------------------------
  const addEnemy = () => {
    const newEnemy = {
      id: Date.now(),
      name: `Undead ${enemies.length + 1}`,
      health: 50,
      maxHealth: 50,
      position: "front",
      effects: [],
      status: [],
    };
    setEnemies([...enemies, newEnemy]);
  };

  const removeEnemy = (enemyId) => {
    setEnemies((prev) => prev.filter((e) => e.id !== enemyId));
  };

  const adjustEnemyHealth = (enemyId, amount) => {
    setEnemies((prev) =>
      prev.map((enemy) => {
        if (enemy.id === enemyId) {
          const updatedHealth = Math.min(
            enemy.maxHealth,
            Math.max(0, enemy.health + amount)
          );
          return { ...enemy, health: updatedHealth };
        }
        return enemy;
      })
    );
  };

  // ---------------------------------
  // CharacterCard Sub-Component
  // ---------------------------------
  const CharacterCard = ({ char }) => {
    const isEditing = editingChar?.id === char.id;

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="border p-1 rounded"
                value={editingChar.name}
                onChange={(e) =>
                  setEditingChar({ ...editingChar, name: e.target.value })
                }
                placeholder="Name"
              />
              <input
                className="border p-1 rounded"
                value={editingChar.class}
                onChange={(e) =>
                  setEditingChar({ ...editingChar, class: e.target.value })
                }
                placeholder="Class"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="border p-1 rounded w-24"
                value={editingChar.maxHealth}
                onChange={(e) =>
                  setEditingChar({
                    ...editingChar,
                    maxHealth: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Max Health"
              />
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={saveCharacter}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{char.name}</h3>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600">{char.class}</span>
                <button
                  className="p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => startEditing(char)}
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>

            {/* Health Bar */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <Heart className="text-red-500" size={20} />
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-red-500 rounded-full h-4"
                    style={{
                      width: `${(char.health / char.maxHealth) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm">
                  {char.health}/{char.maxHealth}
                </span>
              </div>
            </div>

            {/* Status Conditions */}
            <div className="mt-2">
              <h4 className="font-semibold text-sm">Status Conditions:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {char.status.map((stat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full flex items-center gap-1"
                  >
                    <Skull size={14} />
                    {stat}
                    <button
                      className="hover:text-red-500"
                      onClick={() => removeStatus(char.id, idx)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input
                  className="border p-1 rounded text-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="Add status condition"
                />
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  onClick={() => addStatus(char.id, newStatus)}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Effects */}
            <div className="mt-2">
              <h4 className="font-semibold text-sm">Effects:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {char.effects.map((effect, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1"
                  >
                    {effect}
                    <button
                      className="hover:text-red-500"
                      onClick={() => removeEffect(char.id, idx)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input
                  className="border p-1 rounded text-sm"
                  value={newEffect}
                  onChange={(e) => setNewEffect(e.target.value)}
                  placeholder="Add buff/effect"
                />
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  onClick={() => addEffect(char.id, newEffect)}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Inventory */}
            <div className="mt-2">
              <h4 className="font-semibold text-sm">Inventory:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {char.inventory.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-sm bg-gray-100 rounded-full flex items-center gap-1"
                  >
                    {item}
                    <button
                      className="hover:text-red-500"
                      onClick={() => removeInventoryItem(char.id, idx)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <input
                  className="border p-1 rounded text-sm"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="New item"
                />
                <button
                  className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                  onClick={() => addInventoryItem(char.id)}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Actions: Heal / Damage */}
            <div className="mt-4 flex gap-2 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-16 border rounded p-1"
                  value={healAmount}
                  onCh
