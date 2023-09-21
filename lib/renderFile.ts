export async function renderFile(folder: string, filePath: string): Promise<Response> {
    try {
        const file = Bun.file(`./${folder}${filePath}`);

        if(await file.exists()) {
            return new Response(file, {
                headers: {"Content-Type": file.type},
                status: 200
            });
        }
        return new Response("404 Not Found", {status: 404});
    } catch(e) {
        console.log(e);
        return new Response("An error ocurred, try again!", {status: 500});
    }
}