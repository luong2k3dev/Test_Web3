async function main() {
	const contract = await ethers.deployContract('MyToken');
	console.log('Contract address:', await contract.getAddress());
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});