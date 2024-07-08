import random
from data import (words)


def guess_word(candidate):
    correct_letter_and_index = []
    correct_letter_wrong_index = []
    incorrect_letter = []

    word = random.choice(words)
    print(word)
    candidate_lower = candidate.lower()
    print(candidate_lower)

    for i, letter in enumerate(candidate_lower):
        if letter == word[i]:
            correct_letter_and_index.append({"letter": letter, "index": i})
        elif letter in word:
            correct_letter_wrong_index.append({"letter": letter, "index": i})
        else:
            incorrect_letter.append({"letter": letter, "index": i})

    return f'Correct letters and index: {correct_letter_and_index}, Correct letters and wrong index: {correct_letter_wrong_index}, Incorrect letters: {incorrect_letter}'


print(guess_word('frito'))
