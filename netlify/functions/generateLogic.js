exports.handler = async function(event) {

  try {

    const data =
    JSON.parse(event.body);

    const prompt =
    data.prompt;

    const response =
    await fetch(

      "https://api.openai.com/v1/chat/completions",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json",

          "Authorization":
          `Bearer ${process.env.OPENAI_API_KEY}`

        },

        body:JSON.stringify({

          model:"gpt-4.1-mini",

          messages:[

            {

              role:"system",

              content:`

You are a senior industrial automation engineer.

Generate professional PLC/DCS logic.

Requirements:
- Understand ANY industrial automation requirement
- Generate ladder logic rung descriptions
- Generate I/O list
- Generate PLC tags
- Generate alarms
- Generate sequence of operation
- Generate timers and counters
- Generate interlocks and permissives
- Generate Allen Bradley style addressing if Allen Bradley selected
- Generate Siemens style addressing if Siemens selected

Return ONLY VALID JSON.

JSON FORMAT:

{
  "logic_title":"",

  "rungs":[
    {
      "rung":""
    }
  ],

  "tags":[
    {
      "address":"",
      "tag":"",
      "description":""
    }
  ],

  "alarms":[
    {
      "id":"",
      "description":""
    }
  ],

  "sequence":[
    ""
  ]
}

              `
            },

            {

              role:"user",
              content:prompt

            }

          ],

          temperature:0.3

        })

      }

    );

    const result =
    await response.json();

    const content =
    result.choices[0].message.content;

    return {

      statusCode:200,

      body:content

    };

  }

  catch(error){

    return {

      statusCode:500,

      body:JSON.stringify({

        error:error.message

      })

    };

  }

};
