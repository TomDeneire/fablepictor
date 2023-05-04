import csv

DATA_FILE = "data.csv"

PUNCTUATION = {
    "!",
    '"',
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    "§",
    ".",
    "/",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "[",
    "\\",
    "]",
    "^",
    "_",
    "`",
    "{",
    "|",
    "}",
    "~",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
}


def split_to_index_words(data: str) -> list:
    result = []
    for word in data.split(" "):
        word = word.strip()
        word = word.lower()
        for char in PUNCTUATION:
            word = word.replace(char, "", -1)
        if not word == "" and len(word) > 1:
            result.append(word)
    return result


with open(DATA_FILE, "r") as reader:
    csv_reader = csv.reader(reader)
    for index, row in enumerate(csv_reader):
        if index == 0:
            continue
        identifier = row[0]
        labels = []
        fable = row[3]
        labels.append(fable)  # title
        animals = {}
        animals["monkey"] = row[4]
        animals["donkey"] = row[5]
        animals["chicken"] = row[6]
        animals["snake"] = row[7]
        animals["fox"] = row[8]
        manifest = row[39]  # manifest
        permalink = row[41]  # permalink
        summary = row[23]
        page = row[24]
        labels.append(row[12])  # creators
        labels.append(row[13])  # creators
        labels.append(row[16])  # creators
        labels.append(row[17])  # creators
        cloi = row[20]  # cloi
        labels.append(cloi)
        oloi = row[22]  # oloi
        labels.append(oloi)
        labels.append(row[25])  # creators
        labels.append(row[26])  # creators
        labels.append(row[29])  # creators
        labels.append(row[30])  # creators
        labels.append(row[33])  # creators
        labels.append(row[34])  # creators
        place = row[37]
        labels.append(place)
        date = row[38]
        labels.append(date)
        # export data
        for animal, presence in animals.items():
            if not presence == "":
                print(identifier, " tdn:A ", animal)
                print(identifier, " tdn:W ", animal)
        for label in labels:
            if not label == "":
                for word in split_to_index_words(label):
                    print(identifier, " tdn:W ", word)
        print(identifier, " tdn:S ", summary)
        for word in split_to_index_words(summary):
            print(identifier, " tdn:W ", word)
        creators = []
        for i in [12, 13, 16, 17, 25, 26, 29, 30, 33, 34]:
            if not row[i] == "":
                creators.append(row[i])
        print(identifier, " tdn:C ", "; ".join(creators))
        print(identifier, " tdn:M ", manifest)
        print(identifier, " tdn:P ", permalink)
        print(identifier, " tdn:F ", fable)
        print(identifier, " tdn:I ", cloi)
        print(identifier, " tdn:O ", oloi)
        print(identifier, " tdn:L ", place)
        print(identifier, " tdn:D ", date)
        print(identifier, " tdn:X ", page)
