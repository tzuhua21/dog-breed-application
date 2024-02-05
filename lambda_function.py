import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    rekognition = boto3.client('rekognition')

    # Get the object from the S3 event
    bucket = '523finalnew' # It should align your S3 bucket
    key = 'dog.jpg'
    
    # Specify the target dog breeds
    target_breeds = ['Afghan Hound', 'Airedale Terrier', 'Akita', 'Alaskan Malamute', 'American Bulldog', 'American Cocker Spaniel', 'American Eskimo Dog', 'American Foxhound', 'American Pit Bull Terrier', 'American Staffordshire Terrier', 'Australian Cattle Dog', 'Australian Shepherd', 'Australian Terrier', 'Basenji', 'Basset Hound', 'Beagle', 'Bearded Collie', 'Beauceron', 'Belgian Malinois', 'Belgian Sheepdog', 'Belgian Tervuren', 'Bernese Mountain Dog', 'Bichon Frise', 'Black and Tan Coonhound', 'Bloodhound', 'Border Collie', 'Border Terrier', 'Borzoi', 'Boston Terrier', 'Bouvier des Flandres', 'Boxer', 'Boykin Spaniel', 'Briard', 'Brittany', 'Brussels Griffon', 'Bull Terrier', 'Bullmastiff', 'Cairn Terrier', 'Cavalier King Charles Spaniel', 'Chesapeake Bay Retriever', 'Chihuahua', 'Chinese Crested', 'Chinese Shar-Pei', 'Chow Chow', 'Clumber Spaniel', 'Cocker Spaniel', 'Collie', 'Coonhound', 'Dachshund', 'Dalmatian', 'Dandie Dinmont Terrier', 'Doberman Pinscher', 'Dogo Argentino', 'Dogue de Bordeaux', 'English Bulldog', 'English Cocker Spaniel', 'English Foxhound', 'English Setter', 'English Springer Spaniel', 'English Toy Spaniel', 'Entlebucher Mountain Dog', 'Eskimo Dog', 'Field Spaniel', 'Finnish Lapphund', 'Finnish Spitz', 'Flat-Coated Retriever', 'French Bulldog', 'German Pinscher', 'German Shepherd', 'German Shorthaired Pointer', 'German Wirehaired Pointer', 'Giant Schnauzer', 'Glen of Imaal Terrier', 'Golden Retriever', 'Gordon Setter', 'Great Dane', 'Great Pyrenees', 'Greater Swiss Mountain Dog', 'Greyhound', 'Harrier', 'Havanese', 'Irish Setter', 'Irish Terrier', 'Irish Water Spaniel', 'Irish Wolfhound', 'Italian Greyhound', 'Jack Russell Terrier', 'Japanese Chin', 'Japanese Spitz', 'Keeshond', 'Kerry Blue Terrier', 'Komondor', 'Kuvasz', 'Labrador Retriever', 'Lakeland Terrier', 'Leonberger', 'Lhasa Apso', 'Lowchen', 'Maltese', 'Manchester Terrier', 'Mastiff', 'Miniature Bull Terrier', 'Miniature Pinscher', 'Miniature Schnauzer', 'Newfoundland', 'Norfolk Terrier', 'Norwegian Buhund', 'Norwegian Elkhound', 'Norwegian Lundehund', 'Norwich Terrier', 'Nova Scotia Duck Tolling Retriever', 'Old English Sheepdog', 'Otterhound', 'Papillon', 'Pekingese', 'Pembroke Welsh Corgi', 'Petit Basset Griffon Vendéen', 'Pharaoh Hound', 'Plott Hound', 'Pointer', 'Polish Lowland Sheepdog', 'Pomeranian', 'Poodle', 'Portuguese Water Dog', 'Pug', 'Puli', 'Pumi', 'Rat Terrier', 'Redbone Coonhound', 'Rhodesian Ridgeback', 'Rottweiler', 'Saint Bernard', 'Saluki', 'Samoyed', 'Schipperke', 'Scottish Deerhound', 'Scottish Terrier', 'Sealyham Terrier', 'Shetland Sheepdog', 'Shiba Inu', 'Shih Tzu', 'Siberian Husky', 'Silky Terrier', 'Skye Terrier', 'Sloughi', 'Small Munsterlander Pointer', 'Soft-Coated Wheaten Terrier', 'Staffordshire Bull Terrier' ]  # 填写所有目标品种的列表

    # Get the image from the S3 bucket
    response = s3.get_object(Bucket=bucket, Key=key)
    image_bytes = response['Body'].read()

    # Detect labels in the image with Amazon Rekognition
    rekog_response = rekognition.detect_labels(
        Image={'Bytes': image_bytes},
        MaxLabels=10,
        MinConfidence=90
    )

    # Filtering dog breed labels
    dog_breeds = [label['Name'] for label in rekog_response['Labels'] if label['Name'] in target_breeds]

    # Here you would process the dog breed labels as you wish, for example, you could return the first label if it exists
    if dog_breeds:
        return dog_breeds[0]
    else:
        return 'Unknown'
