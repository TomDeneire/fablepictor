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
        part = row[2]
        part_aat = row[3]
        labels = []
        fable = row[4]
        labels.append(fable)  # title
        animals = {}
        animals["monkey"] = row[5]
        animals["donkey"] = row[6]
        animals["chicken"] = row[7]
        animals["snake"] = row[8]
        animals["fox"] = row[9]
        objecttype = row[11]
        objecttype_aat = row[12]
        manifest = row[41]  # manifest
        permalink = row[43]  # permalink
        if permalink.endswith("/N"):
            permalink = permalink[:-2] + "/E"
        summary = row[25]
        page = row[26]
        labels.append(row[14])  # creators
        labels.append(row[15])  # creators
        labels.append(row[18])  # creators
        labels.append(row[19])  # creators
        cloi = row[22]  # cloi
        labels.append(cloi)
        oloi = row[24]  # oloi
        labels.append(oloi)
        labels.append(row[27])  # creators
        labels.append(row[28])  # creators
        labels.append(row[31])  # creators
        labels.append(row[32])  # creators
        labels.append(row[35])  # creators
        labels.append(row[36])  # creators
        place = row[39]
        labels.append(place)
        date = row[40]
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
        for i in [14, 15, 18, 19, 27, 28, 31, 32, 35, 36]:
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
        print(identifier, " tdn:Y ", part)
        print(identifier, " tdn:y ", part_aat)
        print(identifier, " tdn:Z ", objecttype)
        print(identifier, " tdn:z ", objecttype_aat)
