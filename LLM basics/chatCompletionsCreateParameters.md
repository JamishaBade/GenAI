````md
# LLM Parameters — MIT-Level Notes

## 1. model
```js
model: "llama-3.3-70b-versatile"
````

### Definition

Specifies the large language model used to generate responses.

### Key Points

* Determines capability, latency, and cost.
* Larger models (e.g., 70B parameters) generally exhibit stronger reasoning and language understanding.
* Smaller models offer lower latency and reduced cost but weaker performance.

### Practical Guidance

* Use larger models for reasoning, code generation, and complex tasks.
* Use smaller models for simple transformations (translation, formatting).

---

## 2. messages

```js
messages: [
  { role: "system", content: "You are a translator" },
  { role: "user", content: "Translate Hello to French" }
]
```

### Definition

Structured input representing a conversational context.

### Roles

* `system`: Defines global behavior, constraints, and persona.
* `user`: Represents the task or query.
* `assistant`: Represents prior model outputs (used for maintaining conversational state).

### Key Points

* The model conditions on the entire message sequence.
* Ordering matters: later messages have stronger influence.
* The system message acts as a high-level prior over behavior.

### Practical Guidance

* Keep system prompts explicit and unambiguous.
* Avoid conflicting instructions across roles.

---

## 3. temperature

```js
temperature: 0.2
```

### Definition

Controls randomness in token sampling by scaling logits before softmax.

### Technical Detail

Let logits be ( z_i ). Temperature modifies them as:
[
P(i) = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}
]

* ( T \to 0 ): deterministic (argmax behavior)
* ( T = 1 ): original distribution
* ( T > 1 ): flatter distribution (more randomness)

### Practical Guidance

* Low temperature (0–0.3): deterministic, suitable for factual tasks.
* High temperature (>0.7): diverse, suitable for creative tasks.

---

## 4. max_completion_tokens

```js
max_completion_tokens: 200
```

### Definition

Upper bound on the number of tokens generated in the response.

### Key Points

* Prevents excessively long outputs.
* Directly impacts cost and latency.

### Practical Guidance

* Set tightly for bounded tasks (e.g., classification).
* Increase for long-form generation or code.

---

## 5. top_p (nucleus sampling)

```js
top_p: 0.9
```

### Definition

Samples from the smallest set of tokens whose cumulative probability exceeds ( p ).

### Technical Detail

Let tokens be sorted by probability. Choose smallest set ( S ) such that:
[
\sum_{i \in S} P(i) \ge p
]

Then sample from ( S ).

### Key Points

* Adaptive truncation of the probability distribution.
* Reduces low-probability noise.

### Practical Guidance

* Typical values: 0.8–0.95.
* Often used instead of temperature, not in conjunction with aggressive tuning of both.

---

## 6. frequency_penalty

```js
frequency_penalty: 0.5
```

### Definition

Penalizes tokens proportionally to how often they have already appeared.

### Key Points

* Discourages repetition of frequent tokens.
* Useful for long-form text generation.

### Practical Guidance

* Set >0 to reduce redundancy.
* Avoid high values for structured outputs (may distort correctness).

---

## 7. presence_penalty

```js
presence_penalty: 0.5
```

### Definition

Penalizes tokens based on whether they have appeared at least once.

### Key Points

* Encourages introduction of new tokens/topics.
* Less sensitive to frequency than frequency_penalty.

### Practical Guidance

* Use for encouraging diversity in open-ended generation.
* Keep low for deterministic tasks.

---

## 8. stream

```js
stream: true
```

### Definition

Enables incremental token emission as they are generated.

### Key Points

* Reduces perceived latency.
* Requires handling partial outputs in the client.

### Practical Guidance

* Use for interactive applications (chat interfaces).
* Disable for batch processing or when full output is required before processing.

---

## 9. stop

```js
stop: ["\n", "END"]
```

### Definition

Specifies sequences that terminate generation when encountered.

### Key Points

* Hard constraint on output termination.
* Useful for structured or bounded outputs.

### Practical Guidance

* Use for delimiting responses (e.g., JSON, code blocks).
* Ensure stop sequences do not conflict with expected content.

---

# Interaction Effects and Best Practices

## Temperature vs Top-p

* Both control randomness.
* Use one as the primary control mechanism.
* Typical setup:

  * temperature = 0.2–0.5
  * top_p = 0.9

## Deterministic Configuration

For reproducible outputs:

```js
temperature: 0,
top_p: 1
```

## Cost Control

* Limit `max_completion_tokens`.
* Avoid unnecessary conversation history in `messages`.

## Prompt Engineering Hierarchy

1. System message (global constraints)
2. User message (task specification)
3. Assistant messages (context/memory)

---

# Minimal Production Template

```js
const completion = await client.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: "You are a precise and concise assistant." },
    { role: "user", content: "Explain gradient descent." }
  ],
  temperature: 0.3,
  top_p: 0.9,
  max_completion_tokens: 300
});
```

---

# Conceptual Summary

* The model defines the hypothesis class.
* The prompt (messages) defines the conditional context.
* Sampling parameters (temperature, top_p) define the stochastic decoding strategy.
* Penalties modify token likelihoods to shape output distribution.
* Token limits and stop sequences impose hard constraints on generation.


