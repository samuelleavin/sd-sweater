/**
 * 
 * BRAIN STORMING
 * 
 */

/**
 * Operators for quantifiable values
 */
const operators = {
  greaterThan: 'greaterThan',
  lessThan: 'lessThan',
  exists: 'exists',
};

/**
 * Now we can define our rules.
 * Let's use PROCESS OF ELIMINATION.
 */
const rules = [

  // {
  //   category: recommendationCategories.sunglasses,
  //   conditions: [{
  //     weather: coreConditions.clouds,
  //     operator: operators.greaterThan,
  //     threshold: 75,
  //   }],
  // },
  
  // {
  //   category: recommendationCategories.shoes,
  //   conditions: [
      
  //   ]
  // }



  // if cloudiness is greater than 75%, do not wear sunglasses
  // {
  //   condition: coreConditions.clouds,
  //   operator: operators.greaterThan,
  //   threshold: 75,
  //   category: recommendationCategories.sunglasses,
  // },

  // if it is raining, we should wear waterproof jacket and shoes

  {
    condition: mainConditions.rain,
    operator: operators.exists,
    category: recommendationCategories.jacket
  },
  {
    condition: mainConditions.rain,
    operator: operators.exists,
    category: recommendationCategories.shoes,
    itemProp: 'waterproof',
    value: true,
  }
]