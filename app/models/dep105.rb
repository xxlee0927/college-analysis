class Dep105 < ActiveRecord::Base
	self.table_name = "dep_105"
	self.primary_key = "dep_no"

	def short_name
		self.name.sub(College.find(self.college_no).name, "")
	end

	def last_text
		if self.last > 0
			"正取"
		elsif self.last < 0
			"備取" + (String(self.last.abs) rescue nil)
		else
			"無資料"
		end
	end

	def field_text
		field_name = {
			0 => "無資料",
			1 => "教育領域",
			2 => "人文及藝術領域",
			3 => "社會科學、商業及法律領域",
			4 => "科學領域",
			5 => "工程、製造及營造領域",
			6 => "農學領域",
			7 => "醫藥衛生及社福領域",
			8 => "服務領域"
		}
		field_name[self.field]
	end

	def lowest_text
		if self.lowest == 0
			"無資料"
		else
			self.lowest
		end
	end

	has_many :winrate105s
end
