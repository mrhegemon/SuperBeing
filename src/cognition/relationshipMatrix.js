import { database } from "../database.js";

export async function writeRelationshipMatrix(speaker, agent, updateMatrix){
    database.instance.setRelationshipMatrix(speaker, agent, updateMatrix);  
}

export async function readRelationshipMatrix(speaker, agent){
    // Check if we have an opinion yet
    // If not, form one and save the file
    // Read personality
    let relationshipMatrixLines = (await database.instance.getRelationshipMatrix(speaker, agent)).toString().replaceAll('\n\n', '\n').split("\n");
    for (let i = 0; i < relationshipMatrixLines.length; i++) {
        relationshipMatrixLines[i] = relationshipMatrixLines[i].trim();
    }
    relationshipMatrixLines = relationshipMatrixLines.filter(line => line != "");

    // Making a 3x2 array
    const relationshipMatrix = [];
    // For each line in relationshipMatrixLines
    for (const line of relationshipMatrixLines){
        const values = line.split(" ");
        const row = [];;
        row[0] = values[0];
        row[1] = values[1];

        relationshipMatrix.push(row);
    }

    // 0 0 # Alignment - Enemy - Friend
    // 0 1 # Authority - Student teacher
    // 0 0 # Affinity - Repulsed intrigued
    // 0 1 # Limit Alignment
    // 1 1 # Limit Authority
    // 0 0 # Limit Affinity

    const formattedrelationshipMatrix = {
            Enemy: relationshipMatrix[0][0],
            Friend: relationshipMatrix[0][1],
            Student: relationshipMatrix[1][0],
            Teacher: relationshipMatrix[1][1],
            Repulsed: relationshipMatrix[2][0],
            Attracted: relationshipMatrix[2][1],

            EnemyLimit: relationshipMatrix[3][0],
            FriendLimit: relationshipMatrix[3][1],
            StudentLimit: relationshipMatrix[4][0],
            TeacherLimit: relationshipMatrix[4][1],
            RepulsedLimit: relationshipMatrix[5][0],
            AttractedLimit: relationshipMatrix[5][1]
    }

    return formattedrelationshipMatrix;
}