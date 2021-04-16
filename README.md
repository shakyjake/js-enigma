# JS Enigma
A javascript enigma machine solver

Usage:

const Machina = new Enigma(Rotors, Reflector[, Options]);
Machina.Solve('My Secret Message');

`Rotors` is a collection of 2D arrays in the following format:
```
[
	["A", "B", "C", "D"...],
	["E", "Y", "H", "Q"...]
]
```

`Reflector` is a single array, in the same format as a rotor

`Options` is an object with the following possible properties:
* `Match` - _`[string]`_ a string to match
* `MatchMode` - _`[string]`_ either "StartsWith" or "Contains"
* `Callback` - _`[function]`_ what to do with the results
