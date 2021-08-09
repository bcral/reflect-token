pragma solidity ^0.8.6;

// SPDX-License-Identifier: Unlicensed

interface IERC20 {

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) ;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Token is IERC20 {
    
    uint256 private _redistributionValue;
    
    uint256 private _totalSupply = 1000000000000000 * 10**18;
    
    uint256 private _redistributed;
    
    mapping (address => uint256) private _balances;
    mapping (address => mapping(address => uint256)) private _allowances;
    mapping (address => uint256) private _claimedRedistribution;
    

    constructor ()  {
        _balances[msg.sender] = _totalSupply;
    }
    

    function name() public pure returns (string memory) {
        return "Test";
    }

    function symbol() public pure returns (string memory) {
        return "Test";
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address user) public view override returns (uint256) {
    uint256 unclaimed = _redistributionValue - _claimedRedistribution[user];
    uint256 share = unclaimed * _balances[user] / _totalSupply;
        
        return _balances[user] + share;
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        _allowances[sender][msg.sender] -= amount;
        _transfer(sender, recipient, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external override returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external override returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender] - subtractedValue);
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        claimRewards(from);
        claimRewards(to);
        
        _balances[from] -= amount;
        
        uint256 fee = amount * 3 / 100;
        
        _redistributionValue += fee;
        
        _balances[to] += amount - fee;
        
        emit Transfer(from, to, amount);
        
    }
    
    function claimRewards(address user) internal {
        uint256 unclaimed = _redistributionValue - _claimedRedistribution[user];
        uint256 share = unclaimed * _balances[user] / _totalSupply;
        
        if(share > 0){
            _balances[user] += share;
            _claimedRedistribution[user] = _redistributionValue;
        }
    }

   
}
