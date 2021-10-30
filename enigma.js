/*
	JS Enigma machine solver
*/
const Enigma = function(Rotors, Reflector, Config){
	
	const _ = this;
	
	const DefaultConfig = {
		'Match' : '',
		'MatchMode' : '',
		'Callback' : function(Solutions){
			console.log(Solutions);
		}
	};
	
	Config = typeof(Config) === 'undefined' ? {} : Config;
	_.Config = Config;
	_.Config.Match = typeof(_.Config.Match) === 'string' ? _.Config.Match : DefaultConfig.Match;
	_.Config.MatchMode = typeof(_.Config.MatchMode) === 'string' ? _.Config.MatchMode : DefaultConfig.MatchMode;
	_.Config.Callback = typeof(_.Config.Callback) === 'function' ? _.Config.Callback : DefaultConfig.Callback;
	
	if(!_.Config.MatchMode.length){
		_.Config.Match = '';
	}
	
	_.Config.Match = _.Config.Match.toUpperCase();
	
	_.Rotors = Rotors;
	_.Reflector = Reflector;

	_.IsLetter = function(Char){
		return /[A-Z]/.test(Char);
	};
	
	_.NormaliseRotors = function(){
		_.Rotors.forEach(function(Rotor, RotorIndex){
			Rotor.forEach(function(Part, PartIndex){
        Part.forEach(function(Letter, LetterIndex){
          _.Rotors[RotorIndex][PartIndex][LetterIndex] = _.Rotors[RotorIndex][PartIndex][LetterIndex].toUpperCase();
        });
			});
		});
	};
	
	_.RevolveSingle = function(RotorIndex){
		_.Rotors[RotorIndex].forEach(function(Part, PartIndex){
			_.Rotors[RotorIndex][PartIndex].push(_.Rotors[RotorIndex][PartIndex].shift());
		});
	};
	
	_.Revolve = function(){
		_.Rotors.forEach(function(Rotor, RotorIndex){
			_.RevolveSingle(RotorIndex);
		});
	};
	
	_.FindLetterIndex = function(Letter, RotorPart){
		let i = 26;
		while(i){
			i -= 1;
			if(RotorPart[i] === Letter){
				return i;
			}
		}
		throw 'Letter not found while trying to find ' + Letter + ' in ' + RotorPart.join('');
	};
	
	_.ProcessLetter = function(Letter){

		if(_.IsLetter(Letter)){
		
			_.Revolve();
			
			const Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
			Letter = Letter.toUpperCase();
			
			let i = 0;
			let j = _.Rotors.length;
			let k = _.FindLetterIndex(Letter, Letters);
			
			while(i < j){
				
				Letter = _.Rotors[i][0][k];
				k = _.FindLetterIndex(Letter, _.Rotors[i][1]);
				
				i += 1;
				
			}

			Letter = _.Reflector[0][k];
			k = _.FindLetterIndex(Letter, _.Reflector[1]);
			
			while(i){
				
				i -= 1;
				
				Letter = _.Rotors[i][1][k];
				k = _.FindLetterIndex(Letter, _.Rotors[i][0]);
				
			}
			
			return Letters[k];

		} else {
			return Letter;
		}
	
	};
	
	_.ProcessString = function(InputString){
	
		const Letters = InputString.split('');
		const Solution = [];
		
		Letters.forEach(function(Letter){
			Solution.push(_.ProcessLetter(Letter));
		});
		
		return Solution.join('');
	
	};
	
	_.IterateAll = function(Callback){
		let i = 26;
		while(i){
			i -= 1;
			let j = 26;
			while(j){
				j -= 1;
				let k = 26;
				while(k){/* hoo boy */
					k -= 1;
					Callback();
					_.RevolveSingle(2);
				}
				_.RevolveSingle(1);
			}
			_.RevolveSingle(0);
		}
	};

	_.IsDupe = function(Arr, NewItem){
		return Arr.indexOf(NewItem) >= 0;
	};

	_.Solve = function(InputString){
		const Solutions = [];
		InputString = typeof(InputString) === 'string' ? InputString : '';
		if(InputString.length){
			InputString = InputString.toUpperCase();
			if(!_.Config.Match.length){
				Solutions.push(_.ProcessString(InputString));
			} else if(_.Config.MatchMode.toLowerCase() === 'startswith'){
				
				let MatchLength = _.Config.Match.length;
				let InputFragment = InputString.substr(0, MatchLength);
				let RestOfInput = InputString.substr(MatchLength);
				
				_.IterateAll(function(){
					let SolveStart = _.ProcessString(InputFragment);
					if(SolveStart === _.Config.Match){
						let Solution = SolveStart + _.ProcessString(RestOfInput);
						if(!_.IsDupe(Solutions, Solution)){
							Solutions.push(Solution);
						}
					}
				});
				
				
			} else if(_.Config.MatchMode.toLowerCase() === 'contains'){
				
				_.IterateAll(function(){
					let Solution = _.ProcessString(InputString);
					if(Solution.indexOf(_.Config.Match) >= 0){
						if(!_.IsDupe(Solutions, Solution)){
							Solutions.push(Solution);
						}
					}
				});
			
			}
			
		}
		_.Config.Callback(Solutions);
	};
	
	_.NormaliseRotors();
	
};
